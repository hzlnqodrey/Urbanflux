# Delta for Backend Adapters

## ADDED Requirements

### Requirement: KTMB Train Adapter
The system SHALL provide a `KTMBAdapter` that polls `https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb` for real-time train vehicle positions.

#### Scenario: ktmb-valid-feed
- GIVEN the KTMB GTFS-RT endpoint returns a valid protobuf feed
- WHEN the adapter polls the endpoint
- THEN it SHALL parse VehiclePosition entities into UrbanfluxTelemetry with Hub="kuala-lumpur", Mode="RAIL", Operator="KTMB"

### Requirement: Prasarana MRT Feeder Bus Adapter
The system SHALL provide a `KualaLumpurMRTFeederBusAdapter` that polls `prasarana?category=rapid-bus-mrtfeeder`.

#### Scenario: mrt-feeder-valid
- GIVEN the MRT feeder bus endpoint returns a valid protobuf feed
- WHEN the adapter polls
- THEN it SHALL produce telemetry with Hub="kuala-lumpur", Mode="BUS", Operator="Prasarana"

### Requirement: Rapid Penang Bus Adapter
The system SHALL provide a `PenangBusAdapter` that polls `prasarana?category=rapid-bus-penang`.

#### Scenario: penang-bus-valid
- GIVEN the Penang bus endpoint returns a valid feed
- WHEN the adapter polls
- THEN it SHALL produce telemetry with Hub="penang", Mode="BUS", Operator="Prasarana"

### Requirement: Rapid Kuantan Bus Adapter
The system SHALL provide a `KuantanBusAdapter` that polls `prasarana?category=rapid-bus-kuantan`.

#### Scenario: kuantan-bus-valid
- GIVEN the Kuantan bus endpoint returns a valid feed
- WHEN the adapter polls
- THEN it SHALL produce telemetry with Hub="kuantan", Mode="BUS", Operator="Prasarana"

### Requirement: BAS.MY City Bus Adapters
The system SHALL provide adapters for each BAS.MY city: Kangar, Alor Setar, Kota Bharu, Kuala Terengganu, Ipoh, Seremban (A+B), Melaka, Johor Bahru, Kuching.

#### Scenario: mybas-city-valid
- GIVEN a BAS.MY city endpoint returns a valid protobuf feed
- WHEN the adapter polls
- THEN it SHALL produce telemetry with Hub="\<city-slug\>", Mode="BUS", Operator="BAS.MY"

### Requirement: All Adapters Use baseAdapter
All new adapters MUST reuse the existing `baseAdapter` in `kualalumpur/adapter_base.go` (or equivalent) for HTTP polling, retry, health, and error management. Transit modes: BUS (buses) and RAIL (trains).
