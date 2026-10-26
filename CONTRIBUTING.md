# Contributing

Start with a GitHub issue or the app's Community form. Route proposals need human review; passing tests does not establish road safety.

## Add a route

1. Create `src/data/routes/<route-id>.json` using the [data contract](docs/data-model.md). Choose a stable ID that is unique across centres.
2. Add `{ "id": "<route-id>", "path": "../routes/<route-id>.json" }` to the appropriate `src/data/centres/<centre-id>.json` route index.
3. Supply accurate road details, ordered navigation points if available, observation dates and permission to share the material. Remove personal names, vehicle registrations, timestamps and private start/end locations from GPS data.
4. Keep `lastVerifiedAt` and `geometry` null until independent road verification. Do not infer speed limits, priorities or lane instructions from old imagery. Do not enable navigation from an obsolete starting point.
5. Run `npm run build`. Check the centre selector, route search, journal and navigation exports locally with `npm run dev`.
6. Submit a pull request. Maintainers review accuracy, permissions, access restrictions, navigation compatibility and accessibility.

## Add a centre

Create `src/data/centres/<centre-id>.json` with its metadata and route index, then add `{ "id": "<centre-id>", "path": "./centres/<centre-id>.json" }` to `src/data/index.json`. Add its route files and tests. The loader validates index paths, IDs and route ownership.

## Code and data

Code contributions use the MIT licence. Submit your own writing and observations or material you have permission to contribute. Do not include private GPS history. Map providers retain their own terms and required attribution.

Use Node.js 22+; no external runtime packages are required. `npm run check` validates code, registry links, navigation exports, progress compatibility and the local server. Verify Android/iOS imports on physical devices before claiming native compatibility.

Current route states are `unverified` and `historical-reference`. Future verified states need independent reviewer evidence, a verification date and a re-check policy. Withdraw invalid routes until corrected.
