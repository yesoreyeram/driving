# Architecture and next milestones

## MVP boundary

Static web app with native ES modules, no runtime package dependencies and no server secrets. `app.js` owns UI, `domain.mjs` owns validation/search/export, `map.mjs` displays the original external source map previews, and `data/routes.json` is the version-controlled community seed registry. Practice records are browser-local. This keeps public route data separate from private learner data and makes the app easy to self-host.

The navigation model separates sparse source waypoints, verified road-following geometry and provider-specific exports. A waypoint plan is not an exact track. Google links are generated from small ordered slices; GPX exports all points as one route. No provider-specific URL becomes the canonical route representation. No shortest-path result is silently labelled the intended practice course.

## P0: validate real navigation

- Test GPX import, point order and car routing on current OsmAnd Android and iOS versions, documenting exact steps and screenshots.
- Compare each seed's source table with its embedded map points. Known naming inconsistencies are displayed, not resolved speculatively.
- With an instructor, validate source points, current centre location/access and road restrictions. Store named reviewer, evidence and verification date.
- Produce independently checked road-following GPX/GeoJSON geometry. Ensure rerouting does not skip intended learning roads.
- Do not advertise uninterrupted exact-route guidance until the verified geometry and physical-device workflow pass acceptance.

## P1: community data foundation

- Add versioned JSON Schema validation and route/centre validators to CI.
- Review states, required independent approval, route withdrawal and configurable stale-data reminders.
- GPX ingestion with file size bounds, XML hardening, coordinate and legal-road validation, provenance and personal-data removal.
- Routes include scenario anchors, permitted vehicle types, verified travel direction, source licence and change history.
- Self-hosted or managed road-routing adapter (e.g. Valhalla/GraphHopper) behind a provider-neutral interface. Cache by route revision and routing profile. Never use a public demo routing service as a production dependency.
- A tile provider appropriate for scale, with compliant attribution and caching. Do not cache OSM community tiles for offline use.

## P2: practice and moderation

- Multi-centre discovery and community proposals with evidence and independent review.
- Optional accounts and explicit opt-in sync, keeping local-only use available. Separate public route records from private learner notes.
- Rate limits, moderation roles, audit history, abuse reporting and rollback before direct community writes are enabled.
- Offline-friendly app shell and route documents; use a licensed offline map source rather than bulk downloading community tiles.
- Verified route sharing, print briefing and instructor lesson plans. Avoid engagement mechanics that encourage app interaction while moving.

## P3: embedded navigation, if justified

Native or carefully scoped mobile navigation using a supported routing stack, map matching, voice guidance, safe rerouting and background-location permission design. A web MVP cannot promise reliable screen-off guidance. Exact-route practice must handle a missed turn safely, rather than encouraging a late manoeuvre or directing a learner back to an unsafe waypoint.

## Security and reliability

- No external scripts or CDN dependencies. Restrictive script CSP; external frames are limited to Google Maps previews.
- Imported local data is size bounded, validated and whitelisted. All user-rendered text and XML content are escaped.
- GitHub submissions are visible drafts; no embedded GitHub token or direct browser write API.
- Stored learner notes are not shared. Storage errors preserve unreadable data and switch to an explicit memory-only mode with export.
- Navigation and GPX export work independently of the external map preview.
- Source files and route revisions are recoverable in Git. CI checks waypoint order, leg continuity, valid GPX coordinates and data provenance. Hosting should use TLS, security headers and immutable release artifacts.

## Useful references

- Google Maps URL documentation: https://developers.google.com/maps/documentation/urls/get-started
- OsmAnd GPX route navigation: https://osmand.net/docs/user/navigation/setup/gpx-navigation/
- OSM tile policy: https://operations.osmfoundation.org/policies/tiles/
