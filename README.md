# The Workshop

A project / task / maintenance workspace for managing things from first idea
to finished work. The interface is a clean, warm, phase-based tool -- not a
room metaphor (that was tried and dropped; see git history if curious) --
built around five stages an item moves through on its way to done.

## The phases

1. **Ideas** -- low-friction capture. Anything for down the line, no
   commitment implied. "Move this idea" sends it to Upcoming.
2. **Upcoming** -- the project-profile stage for greenlit ideas. Editable
   fields for what will be done, what the result affords, timeframe, target
   date, and what's needed (a checkable resource list). "Send to Up Next"
   moves it into the queue.
3. **Up Next** -- a deliberately small queue (one to three items) for
   planning real-world logistics: which days you'll actually work on it,
   and free-form planning notes. "Start on the Workbench" moves it to
   Active.
4. **Active** (reached from the Dashboard, not its own nav tab) -- the full
   project-immersion view: a task checklist, the resource checklist, a
   running log, and progress. "Mark complete" moves it to Done. Movement is
   never blocked here -- you can mark something complete with open tasks if
   that's the honest state of things.
5. **Done** -- the finished-work record, with simple stats.

The **Dashboard** is the home view: active projects with progress, an
aggregated "what's still needed" list pulled from every active/upcoming/
queued item's outstanding resources, an Up Next preview, and an AI weekly
focus summary.

## AI assist, everywhere it's useful

Several pages have a "✨ [Generate ...]" button -- idea expansion questions,
a project-profile draft, a schedule suggestion, a weekly focus summary, a
progress report. All of these currently run `src/lib/assist.js`, a set of
**deterministic templates, not a real model call** -- there's no backend
wired up yet for that. What's real is the interaction pattern every one of
them follows and that any future AI tool in this app should keep: generate
a draft into a preview, let her read it, and only touch real item state if
she clicks "Use this." Nothing here ever writes to an item on its own.
Wiring `assist.js` up to an actual model call (e.g. a Cloud Function
proxying the Claude API) is the natural next step once this is validated
with real use.

## Data

`src/data/mockItems.js` seeds a starting seed of items shaped like the
`Item` model (kind, status/phase, category, scope, outcome, timeframe,
resources, tasks, planning notes, log). The app is **fully interactive
in-session** -- adding ideas, filling in profiles, checking off resources
and tasks, moving things between phases, logging progress, all of it
mutates real React state -- but **nothing persists past a page reload
yet**. That's the next build phase: swap the in-memory `useState` in
`App.jsx` for a real data layer (Firestore, matching the sync pattern used
elsewhere in this household's tooling), so she can flesh out her real
projects and have them stick.

## Running locally

```
npm install
npm run dev
```

## Deploying to GitHub Pages

`vite.config.js` is set up with `base: '/roc-workspace/'`. Push to `main`
and `.github/workflows/deploy.yml` builds and deploys via GitHub Actions
(Settings → Pages → Source → GitHub Actions, plus allow `main` in the
`github-pages` environment's deployment branch rules).
