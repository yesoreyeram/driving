# Contributing

Start with a GitHub issue or the app's Community form. Route contributions are proposals until reviewed; a successful test suite does not establish road safety.

## Routes and centres

1. Identify the centre and route, with stable IDs. Include source URLs, observation date and permission to share the material.
2. Supply original route points or permission-cleared GPX. Remove personal names, vehicle registrations, timestamps and private start/end locations. Never upload an entire private driving history.
3. Compare waypoints against current road access, one-way restrictions and current signs. An independent reviewer must validate the road path before adding a verification date or verified geometry.
4. Describe uncertainty and changes. Do not infer speed limits, priorities or lane instructions from old map imagery. Avoid directions that lead onto restricted or unsuitable roads.
5. Add the record to `dist/data/routes.json` and extend tests for route-specific invariants. Run `npm run check`.
6. Submit a pull request. A maintainer checks provenance, data permissions, geometry, navigation compatibility, accessibility and safety before merge.

New centres follow the same contract. Use a new `centreId`; do not hard-code another centre into the navigation exporter.

## Code and content permissions

Code contributions use the project's MIT licence. Provide your own writing and route observations, or explicitly document permission and the source's licence. Original factual community data can be proposed under CC0, with that permission stated in the issue/PR. Do not assume that a publicly visible route site, diagram or commercial route database is open licensed. Third-party material retains its own terms.

## Review states

`source-linked` → `community-reviewed` → `road-verified` → `stale` / `withdrawn`.

The current UI seeds only use `source-linked`. Future statuses require reviewer identity, evidence, verification timestamp and re-verification policy; do not just change a badge. Corrections to potentially dangerous advice should be reviewed before feature work. If a route becomes invalid, withdraw it from practice recommendations until resolved.

## Checks

Use Node 22+ and run `npm run check`. Exercise navigation export, search, keyboard controls, small-screen layout and storage failure handling when changing those areas. Device-level GPX imports and native app opening should be checked on Android and iOS before marking compatibility verified.
