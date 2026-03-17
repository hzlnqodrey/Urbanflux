package mybas

import (
	"github.com/urbanflux/hubs-backend/internal/adapters"
	"github.com/urbanflux/hubs-backend/internal/adapters/base"
	"github.com/urbanflux/hubs-backend/internal/models"
)

// BAS.MY city bus endpoint constants
const (
	kangarEndpoint          = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kangar"
	alorSetarEndpoint       = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-alor-setar"
	kotaBharuEndpoint       = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kota-bharu"
	kualaTerengganuEndpoint = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kuala-terengganu"
	ipohEndpoint            = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-ipoh"
	serembanAEndpoint       = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-seremban-a"
	serembanBEndpoint       = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-seremban-b"
	melakaEndpoint          = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-melaka"
	johorEndpoint           = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-johor"
	kuchingEndpoint         = "https://api.data.gov.my/gtfs-realtime/vehicle-position/mybas-kuching"
)

// --- MyBAS Kangar ---

type MyBASKangarAdapter struct{ *base.BaseAdapter }

func NewMyBASKangarAdapter(cfg adapters.AdapterConfig) *MyBASKangarAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kangarEndpoint
	}
	return &MyBASKangarAdapter{base.NewBaseAdapter("MyBAS-Kangar", "kangar", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Alor Setar ---

type MyBASAlorSetarAdapter struct{ *base.BaseAdapter }

func NewMyBASAlorSetarAdapter(cfg adapters.AdapterConfig) *MyBASAlorSetarAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = alorSetarEndpoint
	}
	return &MyBASAlorSetarAdapter{base.NewBaseAdapter("MyBAS-AlorSetar", "alor-setar", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Kota Bharu ---

type MyBASKotaBharuAdapter struct{ *base.BaseAdapter }

func NewMyBASKotaBharuAdapter(cfg adapters.AdapterConfig) *MyBASKotaBharuAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kotaBharuEndpoint
	}
	return &MyBASKotaBharuAdapter{base.NewBaseAdapter("MyBAS-KotaBharu", "kota-bharu", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Kuala Terengganu ---

type MyBASKualaTerengganuAdapter struct{ *base.BaseAdapter }

func NewMyBASKualaTerengganuAdapter(cfg adapters.AdapterConfig) *MyBASKualaTerengganuAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kualaTerengganuEndpoint
	}
	return &MyBASKualaTerengganuAdapter{base.NewBaseAdapter("MyBAS-KualaTerengganu", "kuala-terengganu", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Ipoh ---

type MyBASIpohAdapter struct{ *base.BaseAdapter }

func NewMyBASIpohAdapter(cfg adapters.AdapterConfig) *MyBASIpohAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = ipohEndpoint
	}
	return &MyBASIpohAdapter{base.NewBaseAdapter("MyBAS-Ipoh", "ipoh", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Seremban A ---

type MyBASSerembanAAdapter struct{ *base.BaseAdapter }

func NewMyBASSerembanAAdapter(cfg adapters.AdapterConfig) *MyBASSerembanAAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = serembanAEndpoint
	}
	return &MyBASSerembanAAdapter{base.NewBaseAdapter("MyBAS-Seremban-A", "seremban", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Seremban B ---

type MyBASSerembanBAdapter struct{ *base.BaseAdapter }

func NewMyBASSerembanBAdapter(cfg adapters.AdapterConfig) *MyBASSerembanBAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = serembanBEndpoint
	}
	return &MyBASSerembanBAdapter{base.NewBaseAdapter("MyBAS-Seremban-B", "seremban", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Melaka ---

type MyBASMelakaAdapter struct{ *base.BaseAdapter }

func NewMyBASMelakaAdapter(cfg adapters.AdapterConfig) *MyBASMelakaAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = melakaEndpoint
	}
	return &MyBASMelakaAdapter{base.NewBaseAdapter("MyBAS-Melaka", "melaka", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Johor Bahru ---

type MyBASJohorAdapter struct{ *base.BaseAdapter }

func NewMyBASJohorAdapter(cfg adapters.AdapterConfig) *MyBASJohorAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = johorEndpoint
	}
	return &MyBASJohorAdapter{base.NewBaseAdapter("MyBAS-JohorBahru", "johor-bahru", models.ModeBus, "BAS.MY", cfg)}
}

// --- MyBAS Kuching ---

type MyBASKuchingAdapter struct{ *base.BaseAdapter }

func NewMyBASKuchingAdapter(cfg adapters.AdapterConfig) *MyBASKuchingAdapter {
	if cfg.BaseURL == "" {
		cfg.BaseURL = kuchingEndpoint
	}
	return &MyBASKuchingAdapter{base.NewBaseAdapter("MyBAS-Kuching", "kuching", models.ModeBus, "BAS.MY", cfg)}
}
