package base

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/gtfsrt"
	"github.com/urbanflux/hubs-backend/internal/models"
)

// BaseAdapter contains shared HTTP polling, retry, and health logic
// for all GTFS-RT adapters across any city/operator.
type BaseAdapter struct {
	config     adapters.AdapterConfig
	name       string
	hub        string
	mode       string
	operator   string
	health     adapters.AdapterHealth
	errChan    chan adapters.AdapterError
	cancel     context.CancelFunc
	mu         sync.RWMutex
	httpClient *http.Client
	retries    int // consecutive failure count
}

// NewBaseAdapter creates a new BaseAdapter with the given identity and config.
func NewBaseAdapter(name, hub, mode, operator string, cfg adapters.AdapterConfig) *BaseAdapter {
	return &BaseAdapter{
		config:   cfg,
		name:     name,
		hub:      hub,
		mode:     mode,
		operator: operator,
		health:   adapters.HealthStopped,
		errChan:  make(chan adapters.AdapterError, 64),
		httpClient: &http.Client{
			Timeout: cfg.Timeout,
		},
	}
}

func (b *BaseAdapter) Name() string                         { return b.name }
func (b *BaseAdapter) Errors() <-chan adapters.AdapterError { return b.errChan }
func (b *BaseAdapter) Config() adapters.AdapterConfig       { return b.config }

func (b *BaseAdapter) Health() adapters.AdapterHealth {
	b.mu.RLock()
	defer b.mu.RUnlock()
	return b.health
}

func (b *BaseAdapter) SetHealth(h adapters.AdapterHealth) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.health = h
}

// EmitError sends an error to the error channel without blocking.
func (b *BaseAdapter) EmitError(severity adapters.Severity, kind adapters.ErrorKind, msg string, retryable bool) {
	select {
	case b.errChan <- adapters.AdapterError{
		Severity:    severity,
		Kind:        kind,
		Message:     msg,
		AdapterName: b.name,
		Timestamp:   time.Now().UTC(),
		Retryable:   retryable,
	}:
	default:
		log.Printf("[%s] Error channel full, dropping error: %s", b.name, msg)
	}
}

// Start begins the polling loop. Each tick fetches the GTFS-RT feed,
// parses it, and sends telemetry to the stream channel.
func (b *BaseAdapter) Start(stream chan<- models.UrbanfluxTelemetry) error {
	if b.config.BaseURL == "" {
		return fmt.Errorf("[%s] BaseURL is required", b.name)
	}

	ctx, cancel := context.WithCancel(context.Background())
	b.cancel = cancel
	b.SetHealth(adapters.HealthConnected)
	b.retries = 0

	go func() {
		// Do an initial fetch immediately
		b.pollAndStream(ctx, stream)

		ticker := time.NewTicker(b.config.PollInterval)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				b.SetHealth(adapters.HealthStopped)
				return
			case <-ticker.C:
				b.pollAndStream(ctx, stream)
			}
		}
	}()

	return nil
}

// pollAndStream fetches the GTFS-RT feed, parses it, and streams telemetry.
func (b *BaseAdapter) pollAndStream(ctx context.Context, stream chan<- models.UrbanfluxTelemetry) {
	data, err := b.fetchFeed(ctx)
	if err != nil {
		b.handleFetchError(err)
		return
	}

	// Success — reset retries
	b.retries = 0

	// Parse the protobuf feed
	result := gtfsrt.Parse(data, b.hub, b.mode, b.operator, b.name)

	// Forward parse errors
	for _, parseErr := range result.Errors {
		select {
		case b.errChan <- parseErr:
		default:
		}
	}

	// Update health based on parse results
	if len(result.Telemetry) == 0 && len(result.Errors) > 0 {
		b.SetHealth(adapters.HealthDegraded)
	} else if len(result.Errors) > 0 {
		b.SetHealth(adapters.HealthDegraded)
	} else {
		b.SetHealth(adapters.HealthConnected)
	}

	// Stream valid telemetry
	for _, tel := range result.Telemetry {
		select {
		case stream <- tel:
		case <-ctx.Done():
			return
		default:
			b.EmitError(adapters.SeverityWarning, adapters.ErrUnknown,
				"telemetry channel full, dropping update", true)
		}
	}
}

// fetchFeed performs the HTTP GET request to the GTFS-RT endpoint.
func (b *BaseAdapter) fetchFeed(ctx context.Context) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, b.config.BaseURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}

	// data.gov.my returns HTTP 406 if we explicitly request application/x-protobuf
	// So we omit the Accept header entirely to let the default (*/*) pass through

	resp, err := b.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("http request: %w", err)
	}
	defer resp.Body.Close()

	// Handle HTTP error status codes
	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, &HttpError{StatusCode: resp.StatusCode, Kind: adapters.ErrRateLimit}
	}
	if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden {
		return nil, &HttpError{StatusCode: resp.StatusCode, Kind: adapters.ErrAuth}
	}
	if resp.StatusCode >= 400 {
		return nil, &HttpError{StatusCode: resp.StatusCode, Kind: adapters.ErrNetwork}
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read body: %w", err)
	}

	if len(body) == 0 {
		return nil, fmt.Errorf("empty response body")
	}

	return body, nil
}

// handleFetchError processes HTTP fetch errors, managing retry count and health transitions.
func (b *BaseAdapter) handleFetchError(err error) {
	b.retries++

	if httpErr, ok := err.(*HttpError); ok {
		switch httpErr.Kind {
		case adapters.ErrAuth:
			// Fatal — stop retrying
			b.EmitError(adapters.SeverityFatal, adapters.ErrAuth,
				fmt.Sprintf("authentication failed (HTTP %d)", httpErr.StatusCode), false)
			b.SetHealth(adapters.HealthDisconnected)
			return

		case adapters.ErrRateLimit:
			b.EmitError(adapters.SeverityWarning, adapters.ErrRateLimit,
				fmt.Sprintf("rate limited (HTTP %d)", httpErr.StatusCode), true)
			b.SetHealth(adapters.HealthDegraded)
			return
		}
	}

	// Network / general error
	severity := adapters.SeverityWarning
	if b.retries >= b.config.MaxRetries {
		severity = adapters.SeverityError
		b.SetHealth(adapters.HealthDisconnected)
	} else {
		b.SetHealth(adapters.HealthDegraded)
	}

	b.EmitError(severity, adapters.ErrNetwork,
		fmt.Sprintf("fetch failed (attempt %d/%d): %v", b.retries, b.config.MaxRetries, err), true)
}

func (b *BaseAdapter) Stop() error {
	if b.cancel != nil {
		b.cancel()
	}
	b.SetHealth(adapters.HealthStopped)
	return nil
}

// HttpError wraps HTTP status code errors with an error kind.
type HttpError struct {
	StatusCode int
	Kind       adapters.ErrorKind
}

func (e *HttpError) Error() string {
	return fmt.Sprintf("HTTP %d (%s)", e.StatusCode, e.Kind)
}
