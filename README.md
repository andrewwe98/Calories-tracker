# EatMore

A calorie and macro tracker with an Apple-Fitness-style ring, a fruity animated
background, and a layout that works from a 360 px phone up to a wide desktop.
Everything is logged by hand and stored in your browser — there is no backend,
no account, and no network call after the page loads.

![Routes: Today, Diary, Insights, Settings](https://img.shields.io/badge/routes-4-f97e0b)

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** in strict mode
- **Tailwind CSS v4** with a CSS-first theme (no `tailwind.config.js`)

No UI or charting dependencies: the rings, bar charts, trend line and donut are
hand-authored SVG, and so is the background fruit.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). To see the app with data in
it, go to **Settings → Load sample data**, which drops in three deterministic
weeks of entries.

Other scripts:

```bash
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Routes

| Route       | What it does                                                                      |
| ----------- | --------------------------------------------------------------------------------- |
| `/`         | Today's calorie ring, macro bars, per-meal breakdown, 7-day chart and stat cards   |
| `/log`      | Day-by-day diary: meal sections, inline serving edits, delete                      |
| `/insights` | Calorie trend line, macro donut, weekday averages and most-logged foods            |
| `/settings` | Calorie goal, macro split, display name, sample data and reset                     |

Food can be logged from a built-in library of ~80 common foods (searchable and
filterable by category, with your recents surfaced first) or entered by hand with
your own calories and macros.

## How it is put together

```
src/
├── app/                  route segments, metadata, icon and manifest
├── components/
│   ├── background/       animated fruit artwork
│   ├── charts/           SVG ring/bar/line/donut charts
│   ├── dashboard/        Today view
│   ├── insights/         Insights view
│   ├── log/              diary, day picker, add-entry form, food picker
│   ├── settings/         Settings view
│   ├── shell/            sidebar, top bar, bottom tab bar, add sheet
│   └── ui/               Card, Button, Field, Sheet, ProgressRing, icons
└── lib/                  types, date helpers, food library, store, selectors
```

### State and persistence

`src/lib/store.tsx` holds a `useReducer` store behind a context provider mounted
in the root layout, so state survives client-side navigation. It is persisted to
`localStorage` under `eatmore:state:v1`.

Storage is read in a mount effect rather than during render — reading it during
render would make the server and client markup disagree. Until that read lands,
`hydrated` is `false` and each view renders a skeleton. Anything loaded back out
of storage is validated field by field, and malformed entries are dropped rather
than allowed to crash a render.

### Design system

`src/app/globals.css` defines the theme. Surface and text colours are semantic
CSS variables (`--surface`, `--ink`, `--hairline`) that flip under
`prefers-color-scheme: dark` and are exposed to Tailwind through `@theme inline`,
so components use `bg-surface` / `text-ink-muted` and get dark mode for free
instead of carrying a `dark:` variant on every element. The fruit ramps
(`mango`, `citrus`, `berry`, `kiwi`, `grape`) are fixed brand colours.

All animation is CSS keyframes, and everything is disabled under
`prefers-reduced-motion: reduce`.

### Responsive layout

One shell drives both form factors: a bottom tab bar with a raised log button
below `lg`, and a sticky sidebar with a live "today" summary from `lg` up. The
add-food dialog is a single component that renders as a bottom sheet on phones
and a centred modal on desktop, with Escape handling, scroll locking and a focus
trap.
