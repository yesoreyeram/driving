# Maidstone practice pilot

The current release prioritises personal route testing before wider community contributions. No route has been marked road-verified by this change. No learner names or private observations are included in the repository.

## Before a drive

1. Select Maidstone and open a route card. The route has a shareable URL that survives reload, including on GitHub Pages project paths.
2. Review the navigation status and whole-plan waypoint diagram. Dashed connecting lines are not roads. The existing Google map sections remain available below the diagram.
3. Save a practice plan with a date and focus. Plans appear on the centre's route list and do not count as completed drives.
4. Choose **Practise this route**. Google Maps uses ordered legs; the last leg opened is remembered locally, not marked completed. Alternatively download/share a GPX file for a compatible car-navigation app and review its calculated roads.
5. Check each calculated leg, the start/end points and suitable stopping opportunities with the supervising driver before setting off. Do not interact with the app while driving.

## After parking

- Use **Your route testing notes** to record incorrect points, unexpected turns or changed access, including point/leg numbers. Notes are private to this browser and do not certify the public route.
- Log a completed drive from the saved plan. Its focus is copied into the notes and the plan is removed only after the session saves.
- Edit a session from My practice without creating a duplicate.
- Export progress to back up plans, sessions, saved routes, navigation state and testing notes. Import merges records; existing records win when IDs conflict.

## Acceptance checks on real devices

Automated tests cover URL state, legacy progress migration, validation, waypoint projection, route data, GPX/Google link generation and the build. These do not prove navigation app handoff or mobile layout.

On Android Chrome and iPhone Safari:

- Open a shared Maidstone route link, reload, then use Back/Forward between list, route and journal.
- Search for a road, open a matching card, return to the list and clear filters. Check the zero-results state.
- Open Google Maps leg 1, return, choose another leg, reload and confirm the last-opened leg is retained. Check every waypoint reaches the intended road.
- Download/share GPX, import into a compatible car-navigation app and compare its calculated course with the intended route. Record divergence in route testing notes.
- Create a plan, complete it, edit its log, export, and import in a separate browser. Verify no duplicate session appears.
- At 320px and 390px widths and 200% zoom, check cards, dialogs, navigation selection, map controls and focus visibility. Check keyboard navigation and screen reader dialog names.

## Still requiring real-world work

- Independently confirm route starts, access, ordered waypoints and connecting roads.
- Capture reviewed road-following geometry before displaying route distance or estimated driving duration.
- Add accurately positioned local scenarios after their locations and approach directions are reviewed.
- Verify compatible navigation applications on actual devices. No external app is guaranteed to follow sparse waypoints exactly.

The existing contribution form remains accessible through About & route data, but has been removed from primary navigation during the pilot.

## Scenario preparation and reflection

Driving scenarios now contain three steps: prepare together, choose a practice opportunity, and reflect after parking. The original scenario IDs and reviewed preparation flags are retained. There are two unverified Maidstone places and six general skill exercises.

Search and filters distinguish local places, preparation still to review, and skills marked Working on. Checklists, self-reported practice status and notes save explicitly and are included in progress export/import. Closing a scenario without saving discards edits. Checking all preparation items marks preparation reviewed; it never marks a skill mastered or a route verified. Existing detailed records take precedence over legacy review flags when importing.

Suggested routes match skill tags within the selected centre and require navigation data. They do not establish that a route visits a particular junction. Selecting a route and choosing Save preparation & plan a drive opens a dated plan with the scenario focus prefilled. Saving preparation does not save the plan automatically; cancelling the plan leaves preparation saved.

Additional phone checks:

- Search scenarios, switch each filter, and confirm the empty Local places state outside Maidstone.
- Save a partial checklist and reflection, reopen it, and verify all fields persist after reload.
- Complete all preparation items, then uncheck one and save; Preparation to review must include that scenario again.
- Create a plan from a matched route and confirm its focus matches the chosen scenario.
- Export/import scenario progress, including an older backup with reviewed flags but no detailed scenario records.
- Verify dialog scrolling, checkbox labels, keyboard focus and touch targets. Visual browser and native-device QA remain manual checks.
