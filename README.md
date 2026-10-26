# Routewise

An open-source driving practice companion. Start with Maidstone, learn the local roads, practise transferable skills and share better route knowledge through review.

## What works today

- Ten Maidstone route references, searchable by road and suggested skill focus.
- Original source route maps embedded directly, with a map-part selector for split routes.
- **One complete GPX route plan per route**, stitching the source map parts into a single ordered route. Import into a GPX-capable navigation app such as OsmAnd, select the car profile and review the resulting road path.
- Google Maps universal links as a fallback: sequential legs with no more than three intermediate points each, suitable for the documented mobile browser limit. Boundary points overlap, so no source point is lost.
- Six scenario preparation checklists, including the D junction and Running Horse roundabout.
- Bookmarks, practice duration, self-reported confidence and private notes in browser storage. JSON backup export and validated, non-destructive merge import.
- A contribution form that prepares a GitHub issue for the contributor to review and submit. No silent posting and no unmoderated publication.
- Responsive layout, keyboard-accessible controls and native dialogs.

## Run locally

No dependencies or build step are required. Serve `dist` over HTTP; ES modules and JSON loading do not work by double-clicking `index.html`.

```sh
git clone https://github.com/yesoreyeram/driving.git
cd driving
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. Node 22+ is needed only for checks:

```sh
npm run check
```

## Navigate a practice route

1. Choose a route and select **Full route for navigation**.
2. Download the GPX or use the file sharing option where supported.
3. Import into OsmAnd or another navigation app that supports GPX route points. In OsmAnd, select the car profile, preserve point order, and calculate along roads. Download the relevant app map if needed.
4. Review the calculated path with an instructor while parked. Use Navigate / Follow track from the route's beginning. Exact app controls vary by version.

GPX uses **`rtept` route points**, not a fabricated `trkpt` track. The file retains all source map anchors in order, including intermediate unlabelled coordinates. Near-identical shared map boundaries (within roughly one metre) are merged. It does not assert the exact road path between sparse anchors. Navigation software can choose different roads from the source article's road table. Source centre coordinates are historical; check current centre access and avoid obstructing active tests.

Google Maps can launch the installed mobile app or fall back to a browser. It cannot import this complete GPX route. Its shorter legs are an optional fallback, not a solution for uninterrupted full-route practice. Apple Maps and Waze full-route support is not claimed. No native app handoff has been tested on a physical phone yet.

## Data provenance and safety

Initial factual road references and map-input waypoints come from [Maidstone Test Routes](https://maidstonetestroutes.com/amp/), accessed 26 October 2026. Each route records its article URL and source map URLs. Original prose, diagrams, map tiles and turn instructions have not been republished as project-owned content. Source coordinate labels sometimes differ from the article's road names; both are left visible rather than silently reconciling them.

All seeds are **source-linked, not independently road-verified**. They are practice ideas, not official DVSA routes or a guarantee about a test. Suggested skill tags are editorial learning prompts, not verified attributes of the roads. No exact geometry, distance, duration, speed limit or lane-specific instruction is invented.

Use before and after a drive while safely parked. Learn with a qualified instructor or eligible supervising driver, with the required licence, insurance and plates. Follow current signs and restrictions. Use the current [GOV.UK learning-to-drive guidance](https://www.gov.uk/driving-lessons-learning-to-drive) and [Highway Code](https://www.gov.uk/guidance/the-highway-code). This app is not instructor assessment or proof of test readiness.

## Open-source contributions

See [CONTRIBUTING.md](CONTRIBUTING.md), [the data contract](docs/data-model.md), [architecture and roadmap](docs/architecture.md), and [deployment instructions](docs/deployment.md). Code is MIT licensed. The MIT licence does not relicense third-party articles, Google map products, OSM data or tiles. Original community submissions must include permission and provenance; never submit private GPS history.

## Privacy and limits

No account, server-side learner data, analytics or location recording. Progress remains in this browser and can be cleared by browser settings. Export a backup. Unreadable stored data is preserved; writes stop and the UI warns when storage cannot be used. Local browser storage is not encrypted and is accessible to other users of that browser profile.

The original Google Maps previews load from Google in an external iframe. That provider receives normal map requests. No location is recorded by this app. Route download still works when the preview is unavailable. A provider-neutral map preview with properly licensed tiles is a future improvement.

This MVP has no embedded GPS navigation, road snapping, automated route verification, server accounts, moderation backend or multi-device sync. Those need explicit design and reviewed route geometry before a wider launch.
