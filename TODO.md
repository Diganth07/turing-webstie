# TODO — The Turing Club Website

Tracking what's fixed vs. what's new to build. Move items to `[x]` once done, and feel free to append new ones under the right section.

---

## Fixes

- [x] Make Navbar a bit bigger (height/padding)
- [x] Make the club logo in Navbar bigger and more highlighted/prominent
- [x] Replace "Jain University" with "Jain (Deemed-to-be-University)" everywhere it appears (Navbar, About, Footer, etc.)
- [x] Update real event photos in the HackNCrack section (replace placeholder image paths)
- [X] Update real leader/member images (replace placeholder image paths)
- [X] Restructure Leaders section hierarchy:
  - Faculty Advisor on top (already separate, keep as-is)
  - Below that: President, Vice President, Secretary shown in the middle/featured row
  - Remaining leads (Tech, Design, Social Media, Marketing, Photography) below as usual grid
- [X] Fix production asset paths

---

## Add-ons / Features

- [x] "See Upcoming Events" button (Hero) should scroll/link to the current open event — for now, point it to "Hiring Open — 2nd & 3rd Year Students"
- [x] Add a notification strip below the Navbar (highlighted color — red or a color matching the theme) showing the current upcoming event, e.g. "Hiring Open — 2nd & 3rd Year Students". Should stay visible/persistent until the event changes.
- [x] About Us: add a line about the club supporting and encouraging research
- [x] About Us: mention that the club also runs webinars and seminars, not just hackathons/workshops
- [x] "See More Events" (Events section) should link to a **separate Events page**, not scroll within the homepage:
  - Own hero section with its own heading/subheading and CTA
  - Sub-sections for: Events, Workshops, Seminars, Webinars (3–4 categories)
  - Reuses the same design system (colors, typography, card styles) as the rest of the site
- [X] Add Deeksharambh 2025 and 2026 events, bid & byte events and cybersecurity workshop data

---

## Round 2 — Hiring Results + Hiring 1st Years

Two **independent tasks**, built by two different people. Task A and Task B touch some of the same files, so read **"Who owns what"** and **"Merge order"** below before you start.

| | **Task A — Hiring 2nd & 3rd Year: Results** | **Task B — New "Hiring 1st Years" card** |
|---|---|---|
| Owner | Subham | Swapnil |
| What it is | Finish the *existing* card: announce results, remove all "to be announced" text, remove home-page results links | Build a *brand-new* card with Read More, Results, 4 photos and its own data |
| Suggested branch | `feat/hiring-2nd-year-results` | `feat/hiring-1st-year-card` |
| Results data file | `src/data/results-2nd-year.json` | `src/data/results-1st-year.json` |
| Slug | `hiring-2nd-3rd-year-2026` (already exists) | `hiring-1st-year-2026` (new) |
| Main risk | Breaking/forgetting to remove old "pending" text | Copy-pasting 2nd-year content by mistake |

> Per `CONTRIBUTING.md`: open **one GitHub issue per task**, branch from an up-to-date `main`, run `npm run build` before the PR, and add yourself to `CONTRIBUTORS.md`.

### Shared rules (both tasks)

- Results are shown **tab-wise by domain**, in this order: **Tech, Design, Photography, Marketing, Social Media**. **Tech is the default tab.**
- Each domain's tab lists the **final / selected students** only.
- Results data lives in a **JSON file** (not hardcoded in JSX). One file per hiring drive.
- Use design tokens from `src/index.css` (`bg-surface`, `border-border`, `text-primary-light`, ...). No hardcoded hex colors.
- Check desktop and mobile (tabs must wrap/scroll cleanly on a phone).

### Agreed JSON shape (both files must follow this exactly)

```json
{
  "event": "Hiring 2nd & 3rd Year Students",
  "slug": "hiring-2nd-3rd-year-2026",
  "announcedOn": "YYYY-MM-DD",
  "domains": {
    "tech":         { "label": "Tech",         "selected": [ { "name": "Full Name", "year": "2nd" } ] },
    "design":       { "label": "Design",       "selected": [] },
    "photography":  { "label": "Photography",  "selected": [] },
    "marketing":    { "label": "Marketing",    "selected": [] },
    "social-media": { "label": "Social Media", "selected": [] }
  }
}
```

- Domain keys are fixed: `tech`, `design`, `photography`, `marketing`, `social-media`. Do not rename them.
- A student entry needs at least `name` and `year`. Any extra field (e.g. `program`) must be added by **both** people, or the Results page must treat it as optional.
- An empty `selected` array must render a friendly "No selections announced for this domain yet." message, not a blank tab.
- _Confirm with the team lead which student details are OK to publish before filling real data._

### Who owns what (to avoid merge conflicts)

| File | Subham | Swapnil |
|---|---|---|
| `src/pages/Results.jsx` | **Owns** (rewrites it) | Do not edit |
| `src/data/results/index.js` (new registry, see A5) | **Owns** | Adds **one line** for the 1st-year file only |
| `src/data/results-2nd-year.json` | **Owns** | - |
| `src/data/results-1st-year.json` | - | **Owns** |
| `src/data/events.js` | Edits only the `hiring-2nd-3rd-year-2026` object | Only **adds** the new object + its image imports |
| `src/components/Hero.jsx`, `NotificationBar.jsx`, `src/data/notification.js` | **Owns** | Do not edit |
| `src/pages/OurWork.jsx`, `EventDetail.jsx`, `ResultsButton.jsx` | Only if Subham finds a bug | Only if Swapnil finds a bug; tell Subham first |
| `src/assets/images/events/hiring-1st-year-2026/` | - | **Owns** |

### Merge order

1. **Subham merges first**, because the generic Results page and the results registry come from Task A.
2. Swapnil can build the card, Read More page, photos and JSON in parallel, but **rebases on `main` after Subham merges** and then wires the Results page (B6). In `events.js` both people edit different objects; if Git still complains, resolve locally (not in GitHub's web editor).

---

### Task A — Hiring 2nd & 3rd Year: announce results *(Subham)*

Current state (from the code): the Hero has a "Applications closed — results pending" card with a Results button; `notification.js` says "Hiring Results To Be Announced Soon" with a "View Results" link; `Results.jsx` just says "Results to be announced. Stay tuned!".

**A1. Remove the home page results entry points** *(marked for removal)*
- [ ] `src/components/Hero.jsx`: delete the whole "hiring results card" block (the box with "Hiring · 2nd & 3rd Year Students", "Applications closed — results pending" and the Results button).
- [ ] `src/components/Hero.jsx`: remove the now-unused `import ResultsButton from './ResultsButton';`.
- [ ] `src/components/NotificationBar.jsx`: remove the **"View Results →"** link. If the bar stays in the codebase, make sure it does not point to any results route.
- [ ] `src/data/notification.js`: remove the "Hiring Results To Be Announced Soon" message and the `/our-work/hiring-2nd-3rd-year-2026/results` href. Keep `active: false` so nothing renders.
- [ ] Search the whole `src` folder for any other home-page link to `/results` (`grep -rn -i "result" src`) and remove it. Home must have **no** Results button or redirect.

**A2. Remove every "results to be announced / pending / soon" text**
- [ ] `src/pages/Results.jsx`: remove "Results to be announced. Stay tuned!".
- [ ] Final check: `grep -rn -i -E "to be announced|stay tuned|pending|announced soon" src` returns nothing related to results.

**A3. Create `src/data/results-2nd-year.json`**
- [ ] Use the agreed JSON shape above, `slug: "hiring-2nd-3rd-year-2026"`.
- [ ] Fill in the final/selected students for **Tech, Design, Photography, Marketing, Social Media** (get the final list from the club leads).
- [ ] Set `announcedOn` to the real announcement date.

**A4. Rebuild `src/pages/Results.jsx` as a tabbed page**
- [ ] Tabs: Tech, Design, Photography, Marketing, Social Media. **Tech is the default.**
- [ ] Read the active tab from `?tab=` (e.g. `/our-work/hiring-2nd-3rd-year-2026/results?tab=design`) the same way `OurWork.jsx` does, and fall back to Tech for a missing/invalid value.
- [ ] Show the list of selected students for the active domain, with a count (e.g. "12 selected").
- [ ] Empty domain shows the friendly empty-state message.
- [ ] Keep the existing "Back to ..." link and the same page header style.
- [ ] Page must be **generic** (driven by the slug), so Task B's 1st-year results work with no extra page code.

**A5. Make results lookup generic (this is what unblocks Swapnil)**
- [ ] Create `src/data/results/index.js` exporting a map of slug to JSON, e.g.:
  ```js
  import hiring2nd from '../results-2nd-year.json';
  export const RESULTS = {
    'hiring-2nd-3rd-year-2026': hiring2nd,
    // Task B adds: 'hiring-1st-year-2026': hiring1st,
  };
  ```
- [ ] `Results.jsx` looks up `RESULTS[slug]`. If a slug has no entry, show a neutral "Results aren't available for this event." (do **not** reuse the old "to be announced" wording).
- [ ] Tell Swapnil as soon as this is merged.

**A6. Keep Results buttons only where intended**
- [ ] Results button **stays** on the Our Work > Events card and on the event detail page for this event (`hasResults: true` in `events.js` stays).
- [ ] Update the comment in `ResultsButton.jsx` (it still says the page "just says results are pending").

**A7. Verify and ship**
- [ ] Open `/`, confirm no Results button/link anywhere on the home page and no notification strip.
- [ ] Open Our Work > Events > Hiring 2nd & 3rd Year > **Results**, confirm tabs work, Tech opens first, every domain shows the right names.
- [ ] `npm run build` and `npm run lint` pass.
- [ ] Add yourself to `CONTRIBUTORS.md`, open PR, link the issue.

---

### Task B — New card: "Hiring 1st Years" *(Swapnil)*

Goal: a second hiring card in the **Our Work > Events** tab that behaves exactly like the 2nd & 3rd year card: card with **Read More** and **Results** buttons, a Read More page that goes one level deeper with more content, **4 event photos**, and its own results JSON.

**B1. Collect the content first (blocker)**
- [ ] Get from the team: final title, date, short description (for the card), longer description (for Read More), and which domains were open for 1st years.
- [ ] Get **4 event photos** (JPEG, ideally compressed to a reasonable size).
- [ ] Working title: **"Hiring 1st Year Students"** (matches the existing "Hiring 2nd & 3rd Year Students"; rename if the team prefers "Hiring 1st Years").

**B2. Add the photos**
- [ ] Create folder `src/assets/images/events/hiring-1st-year-2026/`.
- [ ] Add `photo-1.jpeg`, `photo-2.jpeg`, `photo-3.jpeg`, `photo-4.jpeg` (same naming as the other event folders).

**B3. Add the event entry in `src/data/events.js`**
- [ ] Add four image imports (`hiring1stPhoto1` ... `hiring1stPhoto4`) next to the existing `hiringPhoto*` imports.
- [ ] Add a **new object** to `EVENTS` (do not copy-edit the 2nd/3rd year object in place; add alongside it):
  ```js
  {
    slug: 'hiring-1st-year-2026',
    category: 'Events',
    title: 'Hiring 1st Year Students',
    meta: 'Recruitment',
    date: '<Month Year>',
    hasResults: true,
    description: '<short card text>',
    photos: [hiring1stPhoto1, hiring1stPhoto2, hiring1stPhoto3, hiring1stPhoto4],
  }
  ```
- [ ] The card appears automatically in Our Work > Events (`OurWork.jsx` maps over `EVENTS`) with **Read More** and **Results** buttons. Confirm both render.

**B4. Read More page (one step deeper, with more content)**
- [ ] The page is `EventDetail.jsx` at `/our-work/hiring-1st-year-2026`. It currently shows only title, tag, date, `description` and the photos.
- [ ] Add the richer content: the longer write-up (what the drive was, who could apply, which domains, how selection worked), shown on this page and **not** on the card.
- [ ] Prefer adding an optional field to the event object (e.g. `details: [...]` paragraphs/sections) and rendering it in `EventDetail.jsx` **only when present**, so no other event page changes.
- [ ] Confirm all **4 photos** show in the gallery grid.
- [ ] Confirm the Results button shows on this page (it uses `hasResults`).
- [ ] If you change `EventDetail.jsx`, tell Subham (shared file) and keep the change small and backwards compatible.

**B5. Create `src/data/results-1st-year.json`**
- [ ] Use the agreed JSON shape, `slug: "hiring-1st-year-2026"`.
- [ ] Fill in final/selected students per domain (Tech, Design, Photography, Marketing, Social Media). If a domain has none yet, leave `"selected": []`.
- [ ] Do not copy names from `results-2nd-year.json`.

**B6. Wire it into the Results page (after Subham has merged)**
- [ ] `git pull origin main` / rebase to get Subham's generic Results page and `src/data/results/index.js`.
- [ ] Add exactly one import and one registry line for the 1st-year file in `src/data/results/index.js`.
- [ ] Do **not** edit `Results.jsx`. If something is missing in it, ask Subham.
- [ ] Open `/our-work/hiring-1st-year-2026/results` and confirm tabs, Tech default, and correct names.

**B7. Verify and ship**
- [ ] Our Work > Events shows both hiring cards and each Read More / Results button goes to the right slug (1st year card must not open the 2nd/3rd year page or the other way round).
- [ ] The **home page is unchanged** by this task (no new Results button/link; the home Events section is not part of this task).
- [ ] Mobile check for the card, detail page and results tabs.
- [ ] `npm run build` and `npm run lint` pass.
- [ ] Add yourself to `CONTRIBUTORS.md`, open PR, link the issue.

---

### Quick difference summary (Subham vs Swapnil)

| Area | Subham | Swapnil |
|---|---|---|
| Card | Already exists, just stop saying "pending" | Does not exist, create it |
| Read More page | Untouched | New content + 4 photos |
| Home page | **Remove** Hero results card + notification results link | Nothing |
| Results page code | **Rewrite** (tabs, Tech default, generic by slug) | Not touched; only adds a registry line |
| JSON | `results-2nd-year.json` | `results-1st-year.json` |
| Depends on the other? | No | Yes, for step B6 only (needs Subham's merge) |

---

## Notes

- Keep all new work following `CONTRIBUTING.md` (branch naming, PR template, code style)
- Update this file as items are completed or new ones come up