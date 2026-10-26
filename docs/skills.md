# Skills checklist

The Skills checklist replaces Scenarios in primary navigation. It covers all 27 topics in the DVSA learning-to-drive syllabus for England, Scotland and Wales, mapped using `dvsaNumber` in `src/skills.mjs`. It is not an official DVSA assessment or a guarantee of passing.

## Suggested learning sequence

1. Get ready to drive: responsibilities, vehicle checks, setup, controls, passengers and security.
2. Build control and observation: mirrors, signals, moving away, positioning and speed.
3. Handle everyday traffic: planning, other traffic, junctions, roundabouts and crossings.
4. Manoeuvre with care: reversing, parking, turning and emergency-stop preparation.
5. Broaden experience: country roads, dual carriageways, efficiency, weather and darkness.
6. Bring it together: independent driving and separately labelled motorway preparation.

This sequence is Routewise's suggested progression, not a DVSA importance ranking. All topics remain accessible; instructors can introduce and revisit them in a different order. Legal responsibilities, observation and safety remain relevant throughout.

## Tracking and pages

- Master list: search, stage/progress filters, per-skill level selection, Next practice flags and aggregate counts.
- Individual pages: shareable `?view=skills&skill=parking` URLs, previous/next links, practice-topic checkboxes, notes, date reviewed, related exercises and skill-tag route suggestions where available.
- Levels: 0 Not started; 1 Introduced; 2 Helped; 3 Prompted; 4 Independent; 5 Reflection. All values are self-recorded. A level is separate from checked practice topics and never inferred from them.
- No test-readiness percentage or pass prediction. Motorways are explicitly outside the test; learner motorway practice requires an approved driving instructor and a dual-control car. Turning the car around is labelled as a broader skill, not a named current test manoeuvre.
- Safety checks include show-me/tell-me preparation. Moving away covers angled and hill starts. Reversing and parking cover the current test exercise options; driver responsibilities include eyesight preparation.
- Related exercise dialogs retain all former scenario notes and checklists. They do not automatically promote skill levels.

The catalogue is independent of the chosen centre; route suggestions and local exercises use the current centre. A route's matching skill tag is only a suggested focus, not verified suitability or evidence it passes a specific place.

## Storage compatibility

The existing `routewise:v1` record gains an optional `skills` object keyed by stable skill ID. A record has `level`, `checked`, `notes`, `nextFocus` and `date`. Old records default to an empty object. All scenario fields remain intact. Exports include skill records; imports preserve existing skill records when the same ID occurs in both. Unknown or invalid skill records are rejected before replacing progress. Topic indexes are stable within each skill: append new topics rather than reordering existing ones.

List-level changes save immediately. Detail forms require Save skill progress. Save skill progress & plan a drive validates and saves the form before opening a separate dated plan. Closing or leaving a detail page before saving discards its edits. Storage failure keeps changes in memory and displays the existing export warning.

## Coverage references, checked 26 October 2026

- [DVSA syllabus and progress levels](https://www.gov.uk/government/publications/keep-a-record-of-your-pupils-driving-lessons/how-to-record-your-pupils-driving-lessons-and-a-summary-of-the-skills-they-need)
- [Current practical car test format](https://www.gov.uk/driving-test/what-happens-during-test)

Contains public-sector information licensed under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/), including the DVSA syllabus mapping and level names. The teaching prompts and suggested order are Routewise content. No DVSA endorsement is implied. These learning references are separate from the removed third-party route publisher references.

## Validation

Tests cover complete one-to-one syllabus coverage, stage ordering, legacy compatibility, progress validation, filters, deep links and separation of preparation from skill ratings. Existing navigation, scenario and progress tests remain in place.

Manual browser/device checks still required:

- Navigate list → skill → next/previous → Back, reload a shared skill URL, and open it in a new tab.
- Change a master-list level and Next practice flag; verify filters and totals update.
- Save topic checks, a level, notes and date; reload and export/import into another browser.
- Open a related legacy exercise and confirm previous notes remain accessible.
- Use skill-based plan creation and verify the focus is prefilled.
- Check keyboard navigation, 200% zoom, small-phone layouts and screen-reader labels.
