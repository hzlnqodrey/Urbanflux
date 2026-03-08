package adapters

import (
	"strings"
	"testing"
	"time"
)

func TestAdapterError_Error(t *testing.T) {
	err := &AdapterError{
		Severity:    SeverityWarning,
		Kind:        ErrNetwork,
		Message:     "connection refused",
		AdapterName: "Tokyo-Toei",
		Timestamp:   time.Date(2026, 3, 8, 12, 0, 0, 0, time.UTC),
		Retryable:   true,
	}

	result := err.Error()

	// Verify all components are present
	if !strings.Contains(result, "WARNING") {
		t.Error("expected severity in error string")
	}
	if !strings.Contains(result, "Tokyo-Toei") {
		t.Error("expected adapter name in error string")
	}
	if !strings.Contains(result, "NETWORK") {
		t.Error("expected error kind in error string")
	}
	if !strings.Contains(result, "connection refused") {
		t.Error("expected message in error string")
	}
	if !strings.Contains(result, "retryable") {
		t.Error("expected retryable label in error string")
	}
}

func TestAdapterError_NonRetryable(t *testing.T) {
	err := &AdapterError{
		Severity:    SeverityFatal,
		Kind:        ErrAuth,
		Message:     "invalid API key",
		AdapterName: "Tokyo-ODPT",
		Timestamp:   time.Now().UTC(),
		Retryable:   false,
	}

	result := err.Error()
	if !strings.Contains(result, "non-retryable") {
		t.Error("expected 'non-retryable' in error string for Retryable=false")
	}
	if !strings.Contains(result, "FATAL") {
		t.Error("expected FATAL severity")
	}
}

func TestNewAdapterError(t *testing.T) {
	err := NewAdapterError("KL-RapidBus", SeverityError, ErrParse, "invalid protobuf", true)

	if err.AdapterName != "KL-RapidBus" {
		t.Errorf("expected adapter name 'KL-RapidBus', got %q", err.AdapterName)
	}
	if err.Severity != SeverityError {
		t.Errorf("expected severity ERROR, got %q", err.Severity)
	}
	if err.Kind != ErrParse {
		t.Errorf("expected kind PARSE, got %q", err.Kind)
	}
	if !err.Retryable {
		t.Error("expected retryable to be true")
	}
	if err.Timestamp.IsZero() {
		t.Error("expected non-zero timestamp")
	}
}

func TestAdapterHealthConstants(t *testing.T) {
	// Verify the health constants have expected values
	tests := []struct {
		health AdapterHealth
		want   string
	}{
		{HealthConnected, "CONNECTED"},
		{HealthDegraded, "DEGRADED"},
		{HealthDisconnected, "DISCONNECTED"},
		{HealthStopped, "STOPPED"},
	}

	for _, tt := range tests {
		if string(tt.health) != tt.want {
			t.Errorf("expected %q, got %q", tt.want, tt.health)
		}
	}
}

func TestSeverityConstants(t *testing.T) {
	tests := []struct {
		sev  Severity
		want string
	}{
		{SeverityInfo, "INFO"},
		{SeverityWarning, "WARNING"},
		{SeverityError, "ERROR"},
		{SeverityFatal, "FATAL"},
	}

	for _, tt := range tests {
		if string(tt.sev) != tt.want {
			t.Errorf("expected %q, got %q", tt.want, tt.sev)
		}
	}
}

func TestErrorKindConstants(t *testing.T) {
	tests := []struct {
		kind ErrorKind
		want string
	}{
		{ErrNetwork, "NETWORK"},
		{ErrParse, "PARSE"},
		{ErrValidation, "VALIDATION"},
		{ErrTimeout, "TIMEOUT"},
		{ErrAuth, "AUTH"},
		{ErrRateLimit, "RATE_LIMIT"},
		{ErrUnknown, "UNKNOWN"},
	}

	for _, tt := range tests {
		if string(tt.kind) != tt.want {
			t.Errorf("expected %q, got %q", tt.want, tt.kind)
		}
	}
}
