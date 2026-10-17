# ShopOS Feed — design reference

Everything visual lives in `index.html`. Colours, type, radii and motion are tokens on `:root`; change the token, the whole prototype follows. This file is the source of truth for what those tokens mean and the rules we have agreed on. Add to it as decisions are made.

## 1. Colour

Two themes. Dark is the default; the sun/moon in the top bar switches, and the choice is remembered (`localStorage: shopos-theme`). Light is `html[data-theme="light"]`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#e9e9e6` | The page |
| `--s1` | `#151515` | `#ffffff` | A card on the page |
| `--s2` | `#1a1a1a` | `#f3f3f0` | A block inside a card, a hover on a card |
| `--s3` | `#262626` | `#e4e4df` | A chip, a pressed state, your own chat bubble |
| `--s4` | `#2e2e2e` | `#d2d2cc` | A line that must be seen |
| `--line` | `#262626` | `#d6d6d0` | Card borders |
| `--line-soft` | `#1f1f1f` | `#e6e6e1` | Dividers inside cards |
| `--fg` | `#fafafa` | `#0f0f0f` | Headlines, primary text, the primary button |
| `--fg-1` | `#d4d4d4` | `#333331` | Body text in documents and drafts |
| `--fg-2` | `#a3a3a3` | `#5f5f5b` | Secondary text, labels |
| `--fg-3` | `#737373` | `#8a8a85` | Tertiary text, timestamps, placeholders |
| `--fg-4` | `#4a4a4a` | `#b4b4ae` | Disabled text, dotted guides |
| `--ink` | `255,255,255` | `15,15,15` | Tints: `rgba(var(--ink), .08)`. Never hard-code `rgba(255,255,255,…)` |
| `--ok-bg` / `--ok-line` / `--ok-fg` | `#16261b` / `#1f3a27` / `#86efac` | `#e6f6ea` / `#bfe6ca` / `#15803d` | Done, sent, live, connected |
| `--glass` | `rgba(24,24,26,.52)` | `rgba(250,250,248,.62)` | Floating bars and popovers |
| `--glass-line` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.08)` | Glass edge |
| `--glass-hover` | `rgba(var(--ink),.08)` | same | Glass on hover (see rule 3) |
| `--glass-fx` | `blur(22px) saturate(1.7)` | same | Backdrop filter for glass |

Fixed colours that do not change with the theme:
- Green `#4ade80` — the one accent. Ticks, the live dot, "what changed" highlights.
- The brief is paper: `#fbfaf6` background, `#f1eee5` tiles, ink `#1c1c1c`, grey `#6b6b6b`, highlighter `#fde68a`, handwriting blue `#2563eb`, stamp orange `#c2410c` → green `#15803d` when sent.
- Area dots: Brand `#f0a6c8`, Performance `#ef8b33`, Storefront `#e8c34a`, AEO·GEO·SEO `#7aa8ff`, CRM `#5eead4`.
- Team avatars: Riya `#f0a6c8`, Kabir `#ef8b33`, Meera `#5eead4`, Dev `#e8c34a`.
- Connector logos keep their brand colours (Meta `#0866FF`, Shopify `#95BF47`, …).

## 2. Type

- `--font`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. The system font, as Instagram uses it. SF Pro on Apple, Segoe on Windows, Roboto on Android. We do not ship a webfont for UI text.
- `--font-hand`: Caveat (Google Fonts) for margin notes, the brief's handwritten bits and the signature.
- `--font-mono`: SF Mono / JetBrains Mono / ui-monospace for tiny uppercase labels (memo header, section numbers).

Scale (px / line-height):
- Page title 32/38 semibold, letter-spacing −0.015em
- Card title 22/30 medium · Section heading 17/24 semibold
- Body 15–16/24 · Chat 16/24 · Secondary 14/20 · Meta and labels 12.5–13/18
- Micro labels 11–12, uppercase, tracking .06–.14em, mono

Weights: 400 body, 500 titles and buttons, 600 only for the headline and the primary button. Never 700 in UI text.

## 3. Rules

1. **One radius scale.** Containers 20 (`--r-card`), inner blocks 14, controls are pills (999) or 12 (`--r-btn`), small controls 8 (`--r-ctl`). Nested radius = outer − padding.
2. **No hard cuts.** Where content meets a bar or an edge, it fades (mask or gradient to `--bg`), it does not end on a 1px line. Lines are for separating columns, not for ending scroll areas.
3. **Hover is a tint, never a fill.** Interactive things lift by `rgba(var(--ink),.07–.13)` plus a hairline `inset 0 0 0 1px`. Glass stays glass on hover: it brightens, it never goes solid. The only solid primary is the `--fg` button.
4. **Icons draw, they don't spin.** All icons are 1.8–2px stroke line icons, 16–18px. On hover each line is traced in (`pathLength=1`, `stroke-dashoffset 1→0`, 500ms, 70ms stagger). No rotation, no sliding, no waving.
5. **No shimmer loaders.** Progress is a plain bar. The only shimmer is text while an agent is thinking (grey text with a light passing over it), which is the orchestration language and stays.
6. **Motion is one family.** Enter: 400–560ms `cubic-bezier(.22,1,.36,1)` with a 16–24px travel and a fade. Exit: 260–420ms `cubic-bezier(.4,0,.2,1)`. Springy things (chips popping, stamps) use `cubic-bezier(.34,1.4,.64,1)`. Panels slide and soften (blur 2–3px) rather than cut. Everything respects `prefers-reduced-motion`.
7. **Content runs edge to edge.** In the chat every block (draft, image, projection, change note, next-step chips) spans the 800px column. Memory and Connectors are 800px wide. Only your own bubbles and small tags keep their natural width.
8. **One publish button at a time.** The newest version carries its next steps ("Make a second version", "Publish to …"); older versions let go of theirs and the options row drops its copy.
9. **Connecting an account is our window, not theirs.** A ShopOS dialog with the service's name and logo, what will happen, one connect button. Never a copy of a third-party login screen.
10. **Copy is plain.** Sentence case, no exclamation marks, no "AI-powered". Buttons say what happens ("Queue the ads", "Turn on in Klaviyo"). Status is past tense once done ("Queued on Meta").
11. **The brief is a note.** Memo header, stamp, numbered parts, taped-on draft, polaroid assets, signed. It is the one paper surface and keeps its colours in both themes.
12. **Lighter is louder.** Emphasis comes from brightness and weight, not from colour. Green is reserved for done/live.

## 4. Components (where to look in `index.html`)

- Cards: `.card` · CTA: `.cta` (spark icon, becomes a tick when done) · actions: `.act`
- Chat page: `#studio`, `.st-chat`, `.st-dock`, `.st-compose` (model pill `.st-model`) · streaming trace `.tr-*` · drafts `.cm-doc` · next steps `.cm-next`
- Brief: `.st-bpanel` → `.bn-*`
- Confirm/connect dialog: `.act-box` · Team panel: `.team-pop` · Deck: `#deck`, `.col`
- Theme switch: `#theme-btn`, `setTheme()` · Icon draw: `prepIcons()` + `@keyframes icoDraw`

## 5. Changing things

- A colour: edit the token in `:root` (and its light twin in `:root[data-theme="light"]`). Grep for the hex before adding a new one; chances are a token exists.
- The font: change `--font` only.
- A new component: build from `--s1…--s4`, `--fg…--fg-4`, `rgba(var(--ink),…)` and the radius scale. If it needs a new hex, add it here first.
