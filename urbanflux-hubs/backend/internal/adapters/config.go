package adapters

import "time"

// AdapterConfig holds configuration for a hub adapter's connection behavior.
// All fields have sensible defaults via DefaultConfig().
type AdapterConfig struct {
	// PollInterval is how often the adapter fetches data from the upstream API.
	PollInterval time.Duration `json:"pollInterval"`

	// Timeout is the HTTP request timeout for each API call.
	Timeout time.Duration `json:"timeout"`

	// MaxRetries is the maximum number of consecutive failures before
	// the adapter marks itself as DISCONNECTED.
	MaxRetries int `json:"maxRetries"`

	// RetryBackoff is the base duration between retry attempts.
	// Actual backoff uses exponential scaling: RetryBackoff * 2^attempt.
	RetryBackoff time.Duration `json:"retryBackoff"`

	// BaseURL is the upstream API endpoint URL.
	BaseURL string `json:"baseUrl"`

	// APIKey is an optional authentication key for APIs that require it
	// (e.g. ODPT Japan). Leave empty for keyless APIs (e.g. data.gov.my).
	APIKey string `json:"apiKey,omitempty"`
}

// DefaultConfig returns an AdapterConfig with production-ready defaults:
//   - 30s poll interval
//   - 10s timeout
//   - 3 max retries
//   - 2s retry backoff base
func DefaultConfig() AdapterConfig {
	return AdapterConfig{
		PollInterval: 30 * time.Second,
		Timeout:      10 * time.Second,
		MaxRetries:   3,
		RetryBackoff: 2 * time.Second,
	}
}
