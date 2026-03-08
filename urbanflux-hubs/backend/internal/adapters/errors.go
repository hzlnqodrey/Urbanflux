package adapters

import (
	"fmt"
	"time"
)

// --- Adapter Health ---

// AdapterHealth represents the current operational status of an adapter.
type AdapterHealth string

const (
	HealthConnected    AdapterHealth = "CONNECTED"    // Actively receiving and streaming data
	HealthDegraded     AdapterHealth = "DEGRADED"     // Receiving data but with errors or missing fields
	HealthDisconnected AdapterHealth = "DISCONNECTED" // Unable to reach the upstream API
	HealthStopped      AdapterHealth = "STOPPED"      // Adapter has been deliberately stopped
)

// --- Error Severity ---

// Severity indicates the impact level of an adapter error.
type Severity string

const (
	SeverityInfo    Severity = "INFO"
	SeverityWarning Severity = "WARNING"
	SeverityError   Severity = "ERROR"
	SeverityFatal   Severity = "FATAL"
)

// --- Error Kind ---

// ErrorKind categorizes the root cause of an adapter error.
type ErrorKind string

const (
	ErrNetwork    ErrorKind = "NETWORK"    // HTTP/TCP connection failures
	ErrParse      ErrorKind = "PARSE"      // Protobuf/JSON decode failures
	ErrValidation ErrorKind = "VALIDATION" // Invalid data (bad coords, missing fields)
	ErrTimeout    ErrorKind = "TIMEOUT"    // Request or operation timed out
	ErrAuth       ErrorKind = "AUTH"       // Authentication/authorization failures (401/403)
	ErrRateLimit  ErrorKind = "RATE_LIMIT" // HTTP 429 or quota exceeded
	ErrUnknown    ErrorKind = "UNKNOWN"    // Uncategorized errors
)

// --- AdapterError ---

// AdapterError is a structured error emitted by adapters through their error channel.
// It provides rich context for logging, monitoring, and deciding retry behavior.
type AdapterError struct {
	Severity    Severity  `json:"severity"`    // Impact level: INFO, WARNING, ERROR, FATAL
	Kind        ErrorKind `json:"kind"`        // Root cause category
	Message     string    `json:"message"`     // Human-readable error description
	AdapterName string    `json:"adapterName"` // Which adapter produced this error
	Timestamp   time.Time `json:"timestamp"`   // When the error occurred (UTC)
	Retryable   bool      `json:"retryable"`   // Whether the operation can be retried
}

// Error satisfies the Go error interface, producing a structured log-friendly string.
func (e *AdapterError) Error() string {
	retryStr := "non-retryable"
	if e.Retryable {
		retryStr = "retryable"
	}
	return fmt.Sprintf("[%s] %s (%s) [%s] %s — %s",
		e.Severity, e.AdapterName, e.Kind, e.Timestamp.Format(time.RFC3339), e.Message, retryStr)
}

// NewAdapterError creates a new AdapterError with the current UTC timestamp.
func NewAdapterError(adapterName string, severity Severity, kind ErrorKind, message string, retryable bool) *AdapterError {
	return &AdapterError{
		Severity:    severity,
		Kind:        kind,
		Message:     message,
		AdapterName: adapterName,
		Timestamp:   time.Now().UTC(),
		Retryable:   retryable,
	}
}
