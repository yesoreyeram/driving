# Data contract — version 2

## Index graph

`src/data/index.json` is the entry point:

```json
{
  "schemaVersion": 2,
  "centres": [
    {"id": "maidstone", "path": "./centres/maidstone.json"}
  ]
}
```

Each centre file contains its metadata and an ordered route index:

```json
{
  "id": "maidstone",
  "name": "Maidstone",
  "county": "Kent",
  "area": "Kent, South East England",
  "meetingArea": "Armstrong Road",
  "routes": [
    {"id": "maidstone-01", "path": "../routes/maidstone-01.json"}
  ]
}
```

Each referenced route lives in `src/data/routes/<route-id>.json`.

| Field | Meaning |
| --- | --- |
| `id` | Stable, globally unique route ID |
| `centreId` | Must match the centre that indexes this route |
| `number` | Local display number, not a DVSA identifier |
| `title`, `summary` | Route presentation text |
| `roads` | Road highlights, not complete directions |
| `skills`, `skillsStatus` | Suggested learning focuses and their verification status |
| `status` | `unverified` or `historical-reference` for current plans |
| `lastVerifiedAt` | Null until independent on-road verification |
| `geometry` | Null until a verified road-following path is supplied |
| `navigation` | A waypoint plan, a road-name plan, or null |
| `navigation.kind` | `waypoint-plan` or `road-plan` |
| `navigation.waypoints` | Ordered `{lat, lon, label}` anchors |
| `navigation.locations` | Ordered qualified location strings for a road-name plan |
| `navigation.maps` | Functional Google Maps preview URLs |
| `navigation.roadPathVerified` | False for current plans |

Optional centre `notice` and `locationStatus` fields explain uncertain meeting points. Chelmsford routes use `startLocationStatus: obsolete-start` and `navigation: null`; no replacement starting point has been guessed.

The registry loader rejects unsupported versions, paths outside the defined centre/route layout, missing files, duplicate IDs, invalid required fields and centre membership mismatches. Paths resolve relative to each containing JSON document. Files load in parallel while retaining index order. All records currently load at startup so the journal can resolve saved route IDs across centres.

Coordinates are WGS84 latitude/longitude. GPX exports every route point in canonical order as `rtept`; road-name plans cannot produce GPX. Preview map URLs are independent of navigation exports. There are no publisher or citation fields in the registry or GPX metadata.

## Browser-local progress

Storage retains `version: 1` and existing route IDs. Bookmarks, reviewed scenario IDs and sessions survive the registry migration without a local-data rewrite. Sessions contain a unique ID, route ID, date, 1–480 minutes, 1–5 self-reported confidence and up to 2,000 characters of notes. Imports are limited to 5 MB and 10,000 sessions; invalid values or duplicate IDs fail validation. Imports merge by session ID and retain existing records.
