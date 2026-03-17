package mybas

import (
	"testing"

	"github.com/urbanflux/hubs-backend/internal/adapters"
)

// testCase defines a table-driven test for MyBAS adapter constructors.
type testCase struct {
	name         string
	expectedName string
	expectedURL  string
	expectedHub  string
}

var mybasTests = []testCase{
	{"Kangar", "MyBAS-Kangar", kangarEndpoint, "kangar"},
	{"AlorSetar", "MyBAS-AlorSetar", alorSetarEndpoint, "alor-setar"},
	{"KotaBharu", "MyBAS-KotaBharu", kotaBharuEndpoint, "kota-bharu"},
	{"KualaTerengganu", "MyBAS-KualaTerengganu", kualaTerengganuEndpoint, "kuala-terengganu"},
	{"Ipoh", "MyBAS-Ipoh", ipohEndpoint, "ipoh"},
	{"SerembanA", "MyBAS-Seremban-A", serembanAEndpoint, "seremban"},
	{"SerembanB", "MyBAS-Seremban-B", serembanBEndpoint, "seremban"},
	{"Melaka", "MyBAS-Melaka", melakaEndpoint, "melaka"},
	{"JohorBahru", "MyBAS-JohorBahru", johorEndpoint, "johor-bahru"},
	{"Kuching", "MyBAS-Kuching", kuchingEndpoint, "kuching"},
}

// createAdapter is a helper that creates the appropriate adapter by test case name.
func createAdapter(name string, cfg adapters.AdapterConfig) (adapterName string, adapterURL string) {
	switch name {
	case "Kangar":
		a := NewMyBASKangarAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "AlorSetar":
		a := NewMyBASAlorSetarAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "KotaBharu":
		a := NewMyBASKotaBharuAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "KualaTerengganu":
		a := NewMyBASKualaTerengganuAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "Ipoh":
		a := NewMyBASIpohAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "SerembanA":
		a := NewMyBASSerembanAAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "SerembanB":
		a := NewMyBASSerembanBAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "Melaka":
		a := NewMyBASMelakaAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "JohorBahru":
		a := NewMyBASJohorAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	case "Kuching":
		a := NewMyBASKuchingAdapter(cfg)
		return a.Name(), a.Config().BaseURL
	}
	return "", ""
}

func TestMyBAS_AllAdapters_NameAndEndpoint(t *testing.T) {
	for _, tc := range mybasTests {
		t.Run(tc.name, func(t *testing.T) {
			cfg := adapters.DefaultConfig()
			name, url := createAdapter(tc.name, cfg)

			if name != tc.expectedName {
				t.Errorf("expected name %q, got %q", tc.expectedName, name)
			}
			if url != tc.expectedURL {
				t.Errorf("expected URL %q, got %q", tc.expectedURL, url)
			}
		})
	}
}

func TestMyBAS_AllAdapters_CustomEndpoint(t *testing.T) {
	customURL := "http://custom.test/mybas"
	for _, tc := range mybasTests {
		t.Run(tc.name, func(t *testing.T) {
			cfg := adapters.DefaultConfig()
			cfg.BaseURL = customURL
			_, url := createAdapter(tc.name, cfg)

			if url != customURL {
				t.Errorf("expected custom URL %q, got %q", customURL, url)
			}
		})
	}
}

func TestMyBAS_AllAdapters_InitialHealth(t *testing.T) {
	for _, tc := range mybasTests {
		t.Run(tc.name, func(t *testing.T) {
			cfg := adapters.DefaultConfig()
			switch tc.name {
			case "Kangar":
				a := NewMyBASKangarAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "AlorSetar":
				a := NewMyBASAlorSetarAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "KotaBharu":
				a := NewMyBASKotaBharuAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "KualaTerengganu":
				a := NewMyBASKualaTerengganuAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "Ipoh":
				a := NewMyBASIpohAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "SerembanA":
				a := NewMyBASSerembanAAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "SerembanB":
				a := NewMyBASSerembanBAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "Melaka":
				a := NewMyBASMelakaAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "JohorBahru":
				a := NewMyBASJohorAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			case "Kuching":
				a := NewMyBASKuchingAdapter(cfg)
				if a.Health() != adapters.HealthStopped {
					t.Errorf("expected STOPPED, got %q", a.Health())
				}
			}
		})
	}
}
