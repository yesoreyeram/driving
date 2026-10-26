# Routewise

An open-source driving practice companion covering Maidstone, Crawley and Chelmsford. Explore local roads, prepare for driving scenarios and keep a private practice journal.

## Run locally

Node.js 22 or later is the only runtime requirement. No package installation is needed.

```sh
git clone https://github.com/yesoreyeram/driving.git
cd driving
npm run dev
```

Open `http://127.0.0.1:8080`. To use a different port, set `PORT` when running the command. The local server binds to the loopback interface.

```sh
npm run check   # syntax, data, navigation and local-server tests
npm run build   # validate and package src/ into _site/
npm run preview # serve the generated _site/ at the same local URL
```

The app uses ES modules and JSON requests, so serve it over HTTP instead of opening the HTML file directly.

## Features

- Centre selector, route search, suggested skills and centre-specific scenario prompts.
- Ten Maidstone coordinate plans, with a full-route GPX export and segmented Google Maps links.
- Two Crawley road-name plans with Google Maps links; GPX is unavailable until coordinates are added.
- Two historical Chelmsford plans with navigation disabled because they start at the obsolete Hoffmanns Way location. Check your booking for today's meeting point.
- Original preparation checklists for junctions, roundabouts, meeting traffic and independent driving.
- Browser-local bookmarks, practice duration, confidence and notes; JSON backup and validated merge import.
- Community proposals prepared as GitHub issue drafts for the contributor to review and submit.

## Data layout

- `src/data/index.json` lists centre files.
- `src/data/centres/<centre-id>.json` contains centre metadata and an ordered index of its route files.
- `src/data/routes/<route-id>.json` contains one route.
- `src/registry.mjs` loads and validates that graph, including centre membership and duplicate IDs.

All paths are relative to the containing JSON document, preserving GitHub Pages project paths. Route IDs and the browser storage format remain stable, so saved practice logs continue to work. See [the data contract](docs/data-model.md) and [contribution instructions](CONTRIBUTING.md).

## Navigation

Choose a Maidstone route and select **Full route for navigation**. Download the GPX or share it to a compatible app. Import it into a GPX-capable navigation app, choose car routing, preserve point order and review the calculated road path while parked.

GPX contains ordered `rtept` route points, not a verified road-following track. A navigation app can choose different roads between sparse anchors. Google Maps fallback links use no more than three intermediate points per leg, with shared endpoints. Stop safely before opening the next leg. Full-GPX imports into Google Maps, Apple Maps and Waze are not claimed. Physical-device import and handoff still require verification.

## Deployment

The Pages workflow validates pull requests and publishes builds after merges to `main`. Set **Settings → Pages → Source → GitHub Actions** once before the first deployment. The publication directory is `_site/`. See [deployment instructions](docs/deployment.md).

## Privacy and verification

Progress stays in the current browser profile. There are no app accounts, analytics or location recording. Export a backup: browser storage can be cleared and is not encrypted. External map previews receive ordinary network requests.

All plans are unverified practice ideas, not official DVSA routes or guarantees about a test. Skill tags are suggested learning focuses. Confirm current road access, restrictions and the test meeting point with your instructor and booking instructions. Use the app while safely parked, with the appropriate supervision, licence, insurance and learner plates.

Code is MIT licensed. Map providers retain their own terms and attribution. See [architecture](docs/architecture.md) for the application boundaries and next steps.
