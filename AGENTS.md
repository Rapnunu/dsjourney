# DS Prep Tracker — Codex Working Instructions

## Project Purpose

DS Prep Tracker is a personal Data Science internship preparation app.

The application helps track:

* learning roadmap progress
* study sessions
* internship readiness
* analytics
* portfolio projects

Current stack:

* Next.js
* TypeScript
* Tailwind CSS
* App Router
* localStorage for persistence
* Git/GitHub feature-branch workflow

## General Working Rules

Before modifying code:

1. Inspect the existing implementation first.
2. Understand the current architecture before proposing changes.
3. Reuse existing patterns instead of introducing a second competing architecture.
4. Modify only files relevant to the requested feature.
5. Preserve existing UI unless redesign is explicitly requested.
6. Do not commit or push unless explicitly instructed.
7. Report all files created or modified after implementation.

## Architecture

### Study Sessions

Study Sessions use shared state through `SessionProvider`.

The intended flow is:

Study Sessions
→ SessionProvider
→ localStorage
→ Today
→ Analytics

Use the existing:

* `SessionProvider`
* `useSessionStore()`
* `src/lib/storage.ts`

Do not create another study-session store.

Do not create another session localStorage key.

Existing session storage key:

`ds-prep-tracker:sessions`

### Roadmap

Roadmap mastery should use shared state through a Roadmap provider/store.

The intended flow is:

Roadmap mastery changes
→ RoadmapProvider
→ localStorage
→ Roadmap
→ Today
→ Readiness

Roadmap storage key:

`ds-prep-tracker:roadmap`

Keep session and roadmap persistence separate.

## Roadmap Mastery

Supported mastery states:

* `not_started`
* `learning`
* `practiced`
* `mastered`

Use the existing `MasteryLevel` type.

Preserve the existing `MASTERY_WEIGHTS` values unless explicitly requested to change them.

Readiness calculations must derive from the shared roadmap state rather than hardcoded/mock runtime values.

## Mock Data

Mock data may be used only as:

* first-time seed data
* development fallback data

Do not maintain separate runtime mock datasets for different pages.

Avoid architectures such as:

Today → own mock data
Analytics → own mock data
Readiness → own mock data

Prefer one shared source of truth.

## Hydration and Client Persistence

This is a Next.js application, so browser-only APIs must be hydration-safe.

Do not:

* access `localStorage` during SSR
* use `Date.now()` during initial render when it changes server/client output
* use `Math.random()` during initial render
* use `window` directly during SSR
* render mock data and visibly replace it with persisted data after mount
* use `suppressHydrationWarning` as a shortcut
* use arbitrary `setTimeout` delays to hide hydration issues

Use explicit hydration state where needed.

Preferred pattern:

* deterministic server/client initial markup
* load persisted client data after mount
* render a stable skeleton/loading state until hydration completes
* then render persisted state

## UI Rules

Preserve the current design language:

* dark SaaS-style interface
* sidebar navigation
* existing typography
* existing spacing
* existing card design
* existing responsive behavior

Do not redesign pages unless explicitly requested.

Reuse existing components before creating new ones.

## Feature Boundaries

Main features:

* Today
* Roadmap
* Study Sessions
* Analytics
* Readiness
* Portfolio

Keep feature-specific code inside the existing `src/features/` structure where practical.

Avoid dumping unrelated logic into page components.

Prefer:

* providers for shared state
* pure helper functions for calculations
* reusable components for UI
* strongly typed data models

## TypeScript

Keep TypeScript strict.

Do not use `any` unless absolutely unavoidable and explicitly justified.

Prefer existing types such as:

* `StudySession`
* `MasteryLevel`
* `RoadmapCategory`
* `Topic`
* `Project`

Update types cleanly when new fields are required.

## Data Calculations

Analytics should derive from shared Study Session data.

Examples:

* total study hours
* total sessions
* average difficulty
* hours by category
* weekly activity
* difficult topics

Today should derive from shared data where applicable.

Examples:

From Study Sessions:

* total sessions
* study streak
* hours this week

From Roadmap:

* overall readiness
* recommended next topic
* topics due for review

Readiness should derive from shared roadmap mastery state.

Projects may contribute to readiness when that feature is implemented.

## Git Workflow

Use feature branches for major work.

Examples:

* `feature/dynamic-study-sessions`
* `feature/roadmap-persistence`
* `feature/google-auth`
* `feature/supabase-integration`

Before working:

* confirm the active branch
* confirm the working tree state

After implementation:

* do not commit automatically
* do not push automatically
* report changes first
* wait for approval

Commit style examples:

* `feat: implement roadmap persistence`
* `feat: connect analytics to study sessions`
* `fix: stabilize session hydration`
* `refactor: centralize readiness calculations`

## Verification

After meaningful changes, run appropriate checks.

Prefer:

* TypeScript check
* ESLint on affected files
* production build when appropriate
* `git diff --check`

Also manually verify the requested user flow.

For persistence features, test:

1. add/change data
2. navigate to dependent pages
3. confirm dependent values update
4. refresh
5. confirm data persists
6. edit/delete
7. confirm all dependent pages stay synchronized

## Current Development Priority

Favor making the existing system functional and connected before adding unnecessary new features.

Do not add:

* Redux
* Zustand
* a database
* authentication
* AI features
* notifications

unless the requested task specifically calls for them.

## Response Style After Coding

After completing a task, report:

1. what was changed
2. files created
3. files modified
4. how the data flow now works
5. checks performed
6. any remaining issues

Do not commit or push without explicit approval.
