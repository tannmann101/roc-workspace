# The Workshop

A project / task / maintenance management environment for a visual thinker,
styled as a home craft workshop. The interface is a room, not a list: every
zone in the room is a stage in an item's lifecycle, and the room itself is
the dashboard.

See the full build brief in the original task description for the metaphor,
zones, data model, interview plan, and open questions -- this README tracks
build status against that plan.

## Status: Phase 1 -- design pass

Per the build brief's phased plan, this is a **static mockup**, iterated on
before any data layer is wired in:

- **Room view** -- the illustrated workshop dashboard. Five clickable zones
  (Corkboard, Cabinet, Shelf, Workbench, Drawer), each with a live count
  badge and a peek at its top items.
- **The Workbench** -- fully built out zone view (active work, item cards
  with kind/category/due-date/notes).
- **Corkboard, Cabinet, Shelf, Drawer** -- browsable zone views (real mock
  items render, but the zone-specific working controls -- pin/promote,
  groom/date-set, reorder/start, browse-the-record -- are stubbed for a
  later phase).

All data is a hardcoded `mockItems` array (`src/data/mockItems.js`) shaped
like the `Item` entity in the data model sketch. **Nothing persists yet** --
no Firebase, no CRUD. That's phase 2+.

## Running locally

```
npm install
npm run dev
```

## Build phases (from the brief)

1. **Design pass** (this phase) -- static mockup, iterate on the room feel.
2. Data layer -- Item model, statuses, CRUD, local persistence.
3. Zone views wired to real data; room view cues go live.
4. Seed with real interview data; use for a week.
5. Refinements -- recurrence, resource checklists, rainy-day filter, image
   handling, in whatever order a week of real use suggests.

## Open questions (unresolved, carried from the brief)

- Shelf capacity: hard limit or soft convention?
- Where do completed recurring maintenance items respawn (Cabinet or
  Shelf)?
- Notifications/reminders, or purely a pull-based space?
- Does the Drawer keep everything forever, or archive out after a while?

## Deploying to GitHub Pages (later phase)

Once there's a data layer worth deploying, the plan is the same pattern used
elsewhere in this household's tooling: PWA on GitHub Pages via GitHub
Actions, Firebase for shared sync. `vite.config.js` is already set up with
`base: '/roc-workspace/'` for that. A `.github/workflows/deploy.yml` is
included and will activate once this repo has a `main` branch to deploy
from.
