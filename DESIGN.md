# ShopOS Feed — the handbook

This is everything an agent or a person needs to work on the Feed without the conversation that built it. The live version of this document, with every component rendered, is at `index.html#design-system` (or `design-system.html`, or type `/design-system` into Ask ShopOS).

---

## 1. What the Feed is

A brand's AI agents post **drafts** into a feed: ad creatives, pages, emails, store changes, what competitors are running, what people are saying. The brand (today: Arata, a hair-care brand in India) looks at each one and acts.

**Four actions on every card**
1. **More like this** (heart) — tunes the feed.
2. **Shortlist** (bookmark) — keeps it in Deck → Shortlisted.
3. **Jam with the team** (hand) — opens the chat page with the brief ready.
4. **The card's own button** — e.g. "Queue the ads", "Draft the page", "Agree with the call". Make-type buttons open the chat; publish-type buttons open the connect-and-publish dialog; a decision is agreed in place.

**The chat page** — an orchestrator reads the draft, hands work to an agent (Creative director, Performance marketer, Storefront manager, AI visibility, CRM specialist), and streams what it is doing: status lines, the agent pill, tool calls on a thread. Every change makes a new **version** of the draft with the changed parts marked. The newest version carries its next steps: *Make a second version* and one *Publish to …*.

**Two ways out**
- **Send the brief** — a paper note (memo header, numbered parts, the draft taped on, polaroid assets, signed) goes to the ShopOS team. It becomes a ticket; the **"with the team"** pill in the top bar shows who has it and which of five stages it is at (Brief in → Picked up → Making it → Your review → Live).
- **Publish** — our own dialog says what will happen and connects the account (Meta, Shopify, Klaviyo) first if needed, then the card reads "Queued on Meta", "Live on arata.in", and so on.

**Pages**: Feed (stories + cards) · Deck (one column per area: Brand, Performance, Storefront, AEO · GEO · SEO, CRM agent; plus In progress and Shortlisted, opened from the side) · Memory (upload anything; what we learned; rules) · Connectors · Notifications · Ask ShopOS (a chat panel) · Design system.

---

## 2. Files

| File | What it is |
|---|---|
| `index.html` | The whole prototype: CSS, markup, JS. No build step. |
| `brand.js` | Every logo, avatar and team member, in one object (`window.BRAND`). **Change logos here.** |
| `arata-feed.js` | The 157 cards (`window.ARATA.cards`). The ten in the feed are `FEED_IDS` in index.html. |
| `pixels.js` | The pixel glyph set (`window.PIXELS`): filled 300-grid path data. Draw with `pix(name, size, anim?)`. |
| `assets/pixels/` | The same glyphs as standalone white SVG files. |
| `assets/brand/` | The product mark, the six agent avatars, the connector logos. |
| `assets/arata/` | The client's product photos, ads, mark and wordmark. |
| `DESIGN.md` | This file. |
| `design-system.html` | Redirects to `index.html#design-system`. |

Run it: any static server (`python3 -m http.server`) and open `index.html`. The published copy is a private claude.ai artifact; the publish step inlines the `<head>` and ships `assets/` alongside.

---

## 3. Colour

Two themes. Dark is the default. The sun/moon in the top bar switches; the choice is remembered (`localStorage: shopos-theme`). Light is `html[data-theme="light"]` and follows **Apple's system colours**: grouped background, white cells, the systemGray scale, hairline separators, almost no shadow.

Every grey in the CSS is a token. Change the token, the whole prototype follows.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#f2f2f7` | The page |
| `--s1` | `#151515` | `#ffffff` | A card on the page |
| `--s2` | `#1a1a1a` | `#f2f2f7` | A block inside a card, a hover on a card |
| `--s3` | `#262626` | `#e5e5ea` | A chip, a pressed state, your own chat bubble |
| `--s4` | `#2e2e2e` | `#d1d1d6` | A line that must be seen |
| `--line` | `#262626` | `#d9d9de` | Card borders |
| `--line-soft` | `#1f1f1f` | `#e5e5ea` | Dividers inside cards |
| `--fg` | `#fafafa` | `#000000` | Headlines, primary text, the primary button |
| `--fg-1` | `#d4d4d4` | `#1c1c1e` | Body text in drafts and documents |
| `--fg-2` | `#a3a3a3` | `#6e6e73` | Secondary text, labels |
| `--fg-3` | `#737373` | `#8e8e93` | Timestamps, placeholders |
| `--fg-4` | `#4a4a4a` | `#c7c7cc` | Disabled text, dotted guides |
| `--ink` | `255,255,255` | `0,0,0` | Tints: `rgba(var(--ink), .08)`. **Never write `rgba(255,255,255,…)` by hand.** |
| `--sh` | `1` | `.16` | Every shadow alpha is `calc(a * var(--sh))`. Light mode is a whisper. |
| `--ok-bg` / `--ok-line` / `--ok-fg` | `#16261b` / `#1f3a27` / `#86efac` | `#e9f8ee` / `#bfe7cb` / `#248a3d` | Done, sent, live, connected |
| `--glass` | `rgba(24,24,26,.52)` | `rgba(255,255,255,.72)` | Floating bars and popovers |
| `--glass-line` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.07)` | Glass edge |
| `--glass-hover` | `rgba(var(--ink),.08)` | same | Glass on hover |
| `--glass-fx` | `blur(22px) saturate(1.7)` | same | The backdrop filter |

**Fixed colours** (the same in both themes)
- Accent green `#4ade80`: ticks, the live dot, "what changed" highlights. The only accent.
- Paper (the brief): `#fbfaf6` sheet, `#f1eee5` tiles, `#1c1c1e` ink, `#6b6b6b` grey, `#fde68a` highlighter, `#2563eb` handwriting, `#c2410c` stamp → `#15803d` once sent.
- Area dots: Brand `#f0a6c8` · Performance `#ef8b33` · Storefront `#e8c34a` · AEO·GEO·SEO `#7aa8ff` · CRM `#5eead4`.
- Team avatars: Riya `#f0a6c8` · Kabir `#ef8b33` · Meera `#5eead4` · Dev `#e8c34a` (in `brand.js`).
- Connector logos keep their brand colours.

Surfaces that are deliberately **not** themed: the brief, the stickers and margin notes in the feed gutters, the story viewer. Rules for those are skipped by the theme and keep literal colours.

---

## 4. Type

- `--font`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` — the system font, as Instagram uses it. No webfont for UI text.
- `--font-hand`: Caveat (Google Fonts), for margin notes, the brief's handwriting, the signature.
- `--font-mono`: SF Mono / JetBrains Mono / ui-monospace, for micro labels.

| Step | Size / line | Weight | Notes |
|---|---|---|---|
| Page title | 32 / 38 | 600 | letter-spacing −0.015em |
| Card title | 22 / 30 | 500 | |
| Section heading | 17 / 24 | 600 | |
| Body, chat | 16 / 24 | 400 | |
| Secondary | 14 / 20 | 400 | `--fg-2` |
| Meta | 12.5 / 18 | 400 | `--fg-3` |
| Micro label | 11 | 500 | mono, uppercase, tracking .12em |

Weights 400, 500, 600 only. Never 700 in UI text.

---

## 5. Shape, space, motion

**Radius**: containers 20 (`--r-card`) · inner blocks 14 · controls are pills (999) or 12 (`--r-btn`) · small controls 8 (`--r-ctl`). A nested radius is the outer radius minus the padding.

**Space**: a 4px grid; common steps 8, 12, 16, 20, 24, 32. Content columns: feed 500px, chat 800px, Memory and Connectors 800px.

**Motion** — five curves, nothing else:

| Name | Curve | Duration | Used for |
|---|---|---|---|
| Enter | `cubic-bezier(.22,1,.36,1)` | 480ms | Panels, the chat page, the brief: short travel + fade |
| Exit | `cubic-bezier(.4,0,.2,1)` | 320ms | Closing anything, quicker than it opened |
| Spring | `cubic-bezier(.34,1.4,.64,1)` | 420ms | Chips popping, the stamp, a count changing |
| Settle | `cubic-bezier(.32,.72,0,1)` | 500ms | Feed morphing into Deck, the segmented pill |
| Draw | `cubic-bezier(.4,0,.2,1)` | 500ms + 70ms/line | Icon lines tracing in on hover |

Everything respects `prefers-reduced-motion`.

**The page loader** (`pageLoad(what, fn)`): on Feed↔Deck, Memory, Connectors, Design system. Full-screen `--bg`, the product mark breathing, one shimmering line ("Opening your deck"). ~800ms, fades in 320ms and out 420ms.

---

## 6. Icons

Line icons on a 24 grid, 1.8–2px stroke, drawn at 16–20px. They live in three places in `index.html`: the `I` table (card and chat icons), the `I_*` constants (chat page), `NF_I` (notifications), and the rail's inline SVGs.

**On hover, every icon draws itself**: `prepIcons()` sets `pathLength="1"` on each line and `@keyframes icoDraw` runs `stroke-dashoffset 1 → 0`, lines staggered 70ms. Any element matching `button, a, [role=tab], .act, .rail-btn, .notif-row, .st-chip` gets this automatically, including ones added later (a MutationObserver watches). Filled icons do not draw; they stay still.

Add an icon: a new key in `I` with the path data. Use `svg(I.name, size)` to render.

### Pixel glyphs

A second, separate set: filled pixel illustrations (lupin, tulip, sparkle, paw, bud, heart, rose, clover, blossom, twinkle, bolt, chat, chart, star). They are illustrations, not controls: the page loader cycles them, empty states (team panel, In progress, Shortlisted) carry one, and the three Ask suggestions use them as filled icons. They take `currentColor`.

Each glyph has one stepped animation, set in `PIX_ANIM`: **grow** (plants rise from the ground in 7 steps, once), **twinkle** (sparkles blink, loops), **beat** (heart, loops), **stamp** (paw, bolt, chat drop in, once). Steps, not easing: they are pixel art. Loops only where something is waiting. All are off under `prefers-reduced-motion`.

Add one: draw on a 300×300 frame inside 50–250, white fill, export, paste the paths into `pixels.js` without the `fill` attribute, and give it an animation in `PIX_ANIM`.

### Model icons

Auto shows the ShopOS mark. Claude, GPT and Gemini show their own logos from `BRAND.models` (GPT's mark is black and inverts in dark mode).

---

## 7. Components (where they live)

| Component | Selector / function | Notes |
|---|---|---|
| Card | `.card`, `card(post)` | `.is-data` for text cards. The button is `.cta`; `markCard(i, label)` flips it to done. |
| Card actions | `.act`, `.act-jam`, `.bookmark` | |
| Stories | `.stories`, `.story` | Fades at both ends. |
| Top bar | `.seg` (Feed / Deck), `.topbar-right` (team pill, Ask, theme) | Glass. Solid in Deck. |
| Team pill and panel | `.team-pill`, `.team-pop`, `paintTeam()` | Tickets from `kbItems`; stages in `STAGES`. |
| Chat page | `#studio`, `.st-chat`, `.st-dock`, `.st-compose` | 800px column. Model pill `.st-model`. |
| Streaming trace | `.tr`, `.tr-s`, `.tr-pill`, `.tr-tool`, `runFor()` | Shimmer = still working. |
| Draft document | `.cm-doc`, `docHTML()`, `DRAFTS`, `nextDoc()` | Versions; `.is-new` marks what changed. |
| Next steps | `.cm-next`, `nextHTML()` | Only on the newest version. |
| Options row | `.st-quick`, `paintActions()` | View brief · Publish · Projected impact · tweaks. |
| Brief | `.st-bpanel` → `.bn-*`, `briefHTML()` | Paper. `sendBrief()` stamps, flies, makes a ticket. |
| Connect and publish dialog | `.act-box`, `openAct(i, cfg)`, `pubsFor()` | Our window, never theirs. |
| Deck | `#deck`, `.col`, `#deck-side` | `COL_ORDER`, `SECTORS`. Yours lists via `openMine()`. |
| Memory, Connectors | `#mem-page`, `#cx-page` | 800px. |
| Notifications | `.notif-row` | 32px tile, 16px icon. |
| Page loader | `#pload`, `pageLoad()` | |
| Theme | `#theme-btn`, `setTheme()` | |
| Design system | `#ds-page`, `paintDS()` | |

---

## 8. Brand assets — and how to swap them

Everything is in `brand.js`:

```js
window.BRAND = {
  product:    { name:'ShopOS', mark:'assets/brand/mark.svg' },
  client:     { name:'Arata', mark:'assets/arata/mark.svg', logo:'assets/arata/logo.svg' },
  agents:     { creative, performance, storefront, visibility, crm, orchestrator },  // → assets/brand/agent-*.svg
  connectors: { shopify, klaviyo, whatsapp },                                        // → assets/brand/logo-*.png
  team:       { riya, kabir, meera, dev }                                            // name, role, colour
};
```

- **A new product mark**: replace `assets/brand/mark.svg` (square, works at 18–40px, single colour on transparent; light mode inverts it with `filter:invert(1) hue-rotate(180deg)`). Nothing else to touch.
- **A new agent face or connector logo**: replace the file, or point the key at a new path.
- **The product name**: `BRAND.product.name` covers the chat, the brief header and the design system. The name also appears in ~20 lines of copy in `index.html` (e.g. "Ask ShopOS", "the ShopOS team"). Swap them in one go: `sed -i 's/ShopOS/NewName/g' index.html` — then check "Ask NewName" still reads well.
- Static `<img>` tags in the markup carry `data-brand="product.mark"` (etc.) and are resolved from `BRAND` at startup, so the registry is the only source.

---

## 9. Rules

1. **One radius scale.** Containers 20, inner blocks 14, controls pills or 12, small controls 8.
2. **Fade or cut, never half.** Feed and chat scroll areas fade to `--bg` where they meet a bar. The Deck is a fixed board: its bar and column heads end in a clean line. The stories row stays inside the feed column and fades fully to the background at its edges — nothing shows past the column.
3. **Hover is a tint, never a fill.** `rgba(var(--ink), .07–.13)` plus a hairline inset. Glass stays glass on hover: it brightens, it never goes solid. The only solid primary is the `--fg` button.
4. **Icons draw, they don't spin.** No rotation, sliding or waving on hover.
5. **No shimmer loaders.** Progress is a plain bar. Shimmer is for text that is still being written (the agent thinking, the page loader line).
6. **Motion is one family.** The five curves. Panels slide and soften rather than cut.
7. **Content runs edge to edge.** Every block in the chat spans the column. Only your own bubbles and small tags keep their natural width.
8. **One publish button at a time.** The newest version carries its next steps; older versions let go of theirs; the options row drops its copy.
9. **Connecting is our window.** A ShopOS dialog: service name and logo, what will happen, one button. Never a copy of a third-party login.
10. **Copy is plain.** Sentence case. No exclamation marks. Buttons say what happens ("Queue the ads"). Status is past tense once done ("Queued on Meta").
11. **The brief is a note.** Paper, in both themes.
12. **Shadows belong to things that float.** Cards sit flat on a hairline. Popovers, dialogs and the brief cast a shadow, scaled by `--sh`.
13. **Lighter is louder.** Emphasis comes from brightness and weight, not colour. Green is reserved for done and live.
14. **One accent.** If something needs a second colour, it is probably a status, and status is green or nothing.
15. **Pixel glyphs are illustrations.** Filled pixel art for loader, empty states and suggestions; line icons stay for controls.
16. **Real logos, from one place.** Auto is the ShopOS mark; Claude, GPT and Gemini show their own marks (`BRAND.models`). Connectors use real logos where we have them (`BRAND.connectors`, files in `assets/logos/` from the iconify "logos" set) and a lettered tile where we don't (Amazon, Merchant Center, Judge.me). These are third-party trademarks: check each vendor's brand rules before this ships.
17. **Top bar is one glass group.** Team, Ask and theme share one glass pill; every control inside is a full pill. Avatars are plain circles, no ring.
18. **The agent sits by its column.** Next to each Deck title is the agent's face, inlined from its SVG so it can move. Working: the body bobs and squashes, the pupils look around, the eyes blink. Stopped: greyscale at 45%, still. Hover or focus it for a tooltip: name, state, and what it is doing now. The side nav is 288px.
19. **The loader is a beat, not a wait.** One random pixel glyph (never the same twice running) grows in; the page swaps behind the cover at 360ms; after ~1.7s the cover lifts and the page eases in piece by piece (`revealIn`). Animations never run under the loader.
20. **Chats are kept.** Ask ShopOS opens with a greeting and nothing else: no starter prompts, no icons. The pen starts a new chat and files the current one into History (the clock), newest first; any chat reopens where it left off.
21. **Tooltips are white and say one thing.** Every tooltip, in both themes: `--tip-bg` white, `--tip-fg` black, a hairline and a soft shadow, 12.5px/500, radius 8. One short statement — no title line, no subtext, no arrow. Any element with a `title` attribute gets this tooltip (the global `.gtip`), never the browser's own. Chart hovers read as one sentence too ("Day 12: ₹4.2L with this ad, ₹3.9L at today's pace").

---

## 10. Changing things

- **A colour**: edit the token in `:root` and its light twin under `:root[data-theme="light"]`. Grep for the hex first; a token almost certainly exists.
- **The font**: `--font` only.
- **A shadow**: write it with `rgba(0,0,0,calc(a * var(--sh)))` so light mode softens it.
- **A new component**: build from `--s1…--s4`, `--fg…--fg-4`, `rgba(var(--ink),…)`, the radius scale and the five curves. If it needs a new hex, add it to section 3 first.
- **A new rule**: add it to section 9 and to `DS_RULES` in `index.html` so the live page shows it.

## 11. Known fakes

The prototype is a prototype. These are invented and should not be mistaken for data: every number on cards and in projections; the drafts (prices, reviewer names, discount codes, "7.4x less hair fall"); the team (Riya, Kabir, Meera, Dev); brief numbers; the signature ("Vedant"); the model selector (Auto/Claude/GPT/Gemini does nothing); Ask ShopOS answers (every new question gets the same canned reply; the four history chats are written);  voice input (the mic shows a waveform for two seconds, then types one of four canned sentences); the stop button while a run is going; typed requests the draft engine has no recipe for (they get the next pre-written rewrite, labelled with your words).
