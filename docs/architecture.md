# Architecture

Routewise is a static application using native ES modules with no runtime package dependencies. All application files live in `src/`; `_site/` is generated build output.

- `app.js` renders the UI and manages browser-local progress.
- `domain.mjs` handles filtering, progress validation, navigation legs and GPX export.
- `registry.mjs` loads `data/index.json`, centre records and individual route files. It validates their relationships and preserves index order.
- `map.mjs` renders configured Google Maps previews without making those URLs the canonical navigation representation.
- `scripts/serve.mjs` provides the Node-only local development/preview server.
- `scripts/build.mjs` packages validated application files for GitHub Pages.

## Data and compatibility

The root index points to centre files; each centre file indexes its own routes. Separate route files allow focused reviews and independent edits. The current loader retrieves all records in parallel at startup because search, journal labels and import validation require route IDs across centres. Future lazy loading can add a compact metadata index without changing route identities.

Registry schema version 2 does not change progress schema version 1. Route IDs remain stable, so existing journals and bookmarks continue to resolve.

Sparse route points, road-name plans and verified road-following geometry remain distinct concepts. A GPX route plan exports ordered coordinates; Google Maps links use short ordered legs. Neither is labelled an exact track. Historical routes with obsolete starts have no navigation export.

## Security and reliability

Index references are constrained to known local paths, and centre/route IDs must agree. Missing files, duplicate IDs and mismatched membership fail loading and build checks. Imported progress is bounded, whitelisted and validated; rendered user text and GPX text are escaped.

There are no server secrets, tracking or location recording. Learner notes stay in the browser. Unreadable stored data is preserved and the UI enters an explicit memory-only mode. External map providers receive normal preview requests; provider attribution remains intact.

The local server binds to loopback and rejects filesystem escapes. It is not the production runtime: production consists of static Pages artifacts, with deploy permissions isolated to the deployment job.

## Next steps

Independently verify routes and current meeting points, document physical-device imports, and add reviewed road-following geometry before advertising exact-route practice. Future community writes need moderation, audit history and withdrawal/re-verification rules. Optional accounts and sync should preserve local-only use and keep private learner records separate from public route data.
