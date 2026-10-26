# Data contract — version 1

`dist/data/routes.json` is a JSON document with `schemaVersion`, `centres` and `routes`.

| Field | Meaning |
| --- | --- |
| `id` | Stable route ID, unique across centres |
| `centreId` | Existing centre record |
| `number` | Local source route number, not a DVSA identifier |
| `title`, `summary` | Original short presentation text |
| `roads` | Factual road highlights; not a complete direction list |
| `skills` | Suggested practice focuses |
| `skillsStatus` | Distinguishes suggestions from verified road attributes |
| `source` | Publisher, article URL, accessed date |
| `status` | Seeds: `source-linked` or `historical-reference` |
| `lastVerifiedAt` | Null until independent on-road verification |
| `geometry` | Null until a verified road-following path is supplied |
| `navigation.kind` | `source-waypoint-plan` (coordinates) or `source-road-plan` (qualified road names); navigation is null for obsolete starts |
| `navigation.locations` | Ordered road/location strings for a road-name plan; cannot generate GPX |
| `navigation.waypoints` | Ordered `{lat, lon, label, sourceMap}` anchors |
| `navigation.sourceMaps` | Original embedded map URLs for traceability |
| `navigation.roadPathVerified` | False for all current seeds |

Coordinates are WGS84 latitude/longitude; GeoJSON, if later used, has the opposite array order `[longitude, latitude]`. GPX exports named `rtept` elements in exactly the canonical waypoint order. Adjacent source map boundaries closer than approximately one metre were deduplicated during seed assembly; other anchors remain intact. Source map captions and road table names can disagree; no point has been geocoded from an ambiguous name by this app.

Browser-local practice uses `version: 1`, arrays of route ID bookmarks, reviewed scenario IDs and session records. A session contains a unique ID, route ID, date, 1–480 minutes, 1–5 self-reported confidence and up to 2,000 characters of notes. Imports are limited to 5 MB and 10,000 sessions; unknown route IDs, bad dates, duplicate IDs or invalid values are rejected. Imports merge by session ID and retain existing notes.

Before new datasets are public, replace the seed-oriented checks with a published JSON Schema, status transition rules and independent reviewer evidence. Never infer a `road-verified` state from successful parsing or a routing-engine response.

Centres also have `county` for display and map queries. Optional `notice`, `locationStatus` and `locationSources` explain uncertain or relocated meeting points. Centre membership is data-driven; filtering never combines roads from different centres. Crawley has road-name navigation only. Chelmsford retains historical route references with `startLocationStatus: obsolete-source-start` and `navigation: null`; it must not acquire a navigation export until a current route is sourced and checked.
