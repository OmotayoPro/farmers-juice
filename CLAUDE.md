# Farmers Juice — PDP Reference Build

Reference implementation and interactive spec for the updated Farmers Juice product-page experience. Built for the S8 dev team as a working reference, and for the client to review on desktop and mobile. **Structured to mirror a Shopify section for straightforward conversion to Liquid. This is not a production build.**

---

## Purpose & audience

- **Primary goal:** make the approved PDP design feel as real as possible — real content, real assets, real interactions — hosted so it can be opened on a phone and a laptop.
- **Client (Farmers Juice):** reviews the demo, gives feedback, chooses between the two carousel/card variants.
- **S8 (implementers):** use this as the reference for building the real thing in the Shopify Liquid theme. Code is organized so the conversion is mechanical, not a re-interpretation.
- **Explicitly:** this replaces neither S8 nor the production theme. It de-risks their build by resolving behaviour the static Figma can't express.

---

## Stack & tooling

- **Vite, static output.** No framework. `vite build` emits static HTML/CSS/JS that deploys to Vercel with no config.
- **Vanilla JavaScript.** No UI library, no jQuery, no Alpine. Interactions are hand-written and small.
- **Plain CSS with custom properties.** No Tailwind, no CSS-in-JS. Custom properties map 1:1 onto the design tokens and onto Liquid `{% style %}` blocks later.
- **No runtime data fetching.** All product data is committed as static fixtures (see Data).

### Do not
- Do not add React, Vue, Svelte, Next, Astro, or any framework.
- Do not add a CSS utility framework or component library.
- Do not introduce a build step beyond Vite.
- Do not fetch from any API at runtime — the demo must render identically offline.
- Do not use `localStorage`/`sessionStorage` for state — keep state in memory.

---

## Repo structure — mirror a Shopify theme

Organize so each unit maps to a Liquid concept S8 will recognize:

```
/
├── index.html                 # PDP entry (Greens)
├── sections/                  # one file per major page section (→ Liquid sections)
│   ├── pdp-hero.html          #   hero: gallery + buy box
│   ├── nutrition-facts.html   #   nutrition modal markup
│   ├── product-grid.html      #   below-fold grid + filters
│   └── support-banner.html    #   customer-support banner
├── snippets/                  # small reusable partials (→ Liquid snippets)
│   ├── juice-card.html
│   ├── gallery-thumbnails.html
│   └── gallery-bullets.html
├── assets/
│   ├── tokens.css             # generated from Figma variables — do not hand-edit
│   ├── base.css               # resets, typography, layout primitives
│   ├── components.css         # per-component styles
│   ├── app.js                 # interaction wiring
│   └── fonts/                 # self-hosted brand fonts
├── content/
│   ├── greens.json            # committed product fixture
│   └── variety-box.json       # committed product fixture
├── public/images/             # original-resolution product images
├── README.md                  # framing, scope, what's excluded, how to run
└── CLAUDE.md                  # this file
```

Markup inside `sections/` and `snippets/` should be structured the way a Liquid section would be — a clear outer wrapper, predictable class names, content that would map to `{{ product.title }}` etc. Write it so wrapping it in Liquid tags is find-and-replace, not a rewrite.

---

## Design source of truth

- **Figma file:** Farmers Juice Web 2.0, section `product-page-section` (node `2156:89`).
- All screens exist in the Figma for **both desktop and mobile** — pull layout, spacing, and values from there, not from guesses.
- **Tokens flow one way: Figma variables → `tokens.css`.** Never hand-author a hex or spacing value in component CSS; reference a custom property. If a needed token is missing, add it to `tokens.css` with a clear name, don't inline it.
- The Figma has a `Product Selection` variable collection with modes **Greens / Ginger / Orange / Peach**. Mirror this as `[data-product="greens"]` overriding a small set of custom properties, so a product swap is a data attribute — this is how the "build once, configure twice" requirement is demonstrated.

---

## Fonts

- **Campton** and **Peperoncino Sans** — owned by Farmers Juice, cleared for web use. **Self-host** from `assets/fonts/`.
- Peperoncino Sans: display/title. Campton: body and UI. Match the weights used in Figma (Campton Book/Medium/SemiBold/Bold; Peperoncino Regular).
- Use `font-display: swap` and set fallback metrics to avoid layout shift on load.

---

## Data & assets

- **Product data:** pulled once from the live store's public product JSON and committed as static JSON in `/content`. Real titles, ingredients, prices, plant counts.
- **Images:** original-resolution product images pulled from the live CDN (strip the size suffix to get originals) and committed to `/public/images`. No hotlinking to their CDN at runtime.
- **Both products in scope:** Greens **and** Variety Box, so the config-not-rebuild claim is provable.

---

## Build scope — two variants, built sequentially

The two variants differ **only** in the above-the-fold gallery and the juice-card style:

- **Variant 1 — Thumbnail carousel.** Build this **first, complete and signed off, before starting Variant 2.**
- **Variant 2 — Bullet carousel.** Build only after Variant 1 is approved.

Each variant deploys to its **own preview URL** (separate branch) so the client compares by tapping between two links, not by imagining.

### Screens (all designed for desktop + mobile)
- PDP (hero: gallery + buy box)
- Nutrition facts modal + expanded/zoom state
- Above-the-fold gallery (thumbnail variant / bullet variant)
- Below-the-fold product grid with filters
- Customer-support banner

---

## Interaction spec — what is wired vs. static

Build exactly these behaviours. Everything not listed as interactive is **static (designed, not wired).**

### Interactive
1. **Filter buttons ("under 1 / 2 / 3")** — functionally filter the visible product grid against the committed data.
2. **Select-box component** — opens to reveal other products. **Visual only:** selecting a product does **not** navigate (only this page exists).
3. **Product cards in the grid** — clicking a card does **nothing** (no product pages exist). The grid re-filters; the cards themselves are inert.
4. **Juice tabs** — clicking switches the active tab.
5. **Thumbnail carousel** — clicking a thumbnail changes the main hero image.
6. **Nutrition facts** — the trigger opens the nutrition modal (see state machine below).

### Nutrition modal — layered state machine
Three states, navigated as a stack. **X or Back pops exactly one level.**

```
closed  ──(open trigger)──▶  modal open  ──(click an image)──▶  zoom open
zoom open  ──(X / Back)──▶  modal open  ──(X / Back)──▶  closed
```

- Opening the modal: overlay dims the page, page scroll locks, focus moves into the modal and is trapped.
- Clicking an image inside the modal: zoom view **stacks on top** of the modal (modal stays mounted underneath).
- **X or Back never closes everything at once** — it always steps back one level. From zoom you land back on the still-open modal; from the modal you land back on the page.
- Escape key and backdrop click behave like X: pop one level.
- Restore focus to the trigger when the modal fully closes.

### Inert-by-design (present but not functional)
- Add-to-cart / primary CTA — rendered, styled, does nothing (no cart).
- Product navigation, checkout, account, search — **out of scope entirely.**

State the exclusions in the README so absence reads as a decision, not an unfinished build.

---

## Motion

- Restrained and fast. No decorative or long animations.
- Gallery image change, modal open, zoom open: quick and functional.
- **Respect `prefers-reduced-motion`** — reduce or remove transitions when set.

---

## Responsive

- Standard breakpoints (assumption — noted here because S8's exact values weren't confirmed):
  - mobile ≤ 640px
  - tablet 641–1024px
  - desktop ≥ 1025px
- If S8's real breakpoints arrive, update `tokens.css` and this section.
- **Mobile fold reality:** above-the-fold content is tight on mobile. The gallery image ratio is ~1:1.2 (826×994). Budget the primary CTA accordingly — a sticky mobile add-to-cart is expected rather than optional. Use `svh`, not `vh`, for any full-height sizing.

---

## Definition of done — per component

A component is done only when all of these hold:

- [ ] Renders correctly at all three breakpoints (desktop + mobile designs both matched)
- [ ] All interaction states present: default, hover, focus, active, disabled where applicable
- [ ] Keyboard operable — every interactive element reachable and activatable by keyboard
- [ ] Visible focus states (`:focus-visible`)
- [ ] Modal: focus trapped, scroll locked, Escape and backdrop pop one level, focus restored on full close
- [ ] No cumulative layout shift on image or font load
- [ ] No hardcoded colors or spacing — everything references a token
- [ ] `prefers-reduced-motion` respected
- [ ] Reasonable Lighthouse scores (no obvious performance or a11y regressions)

---

## Workflow

- One PR per section/feature. Each PR gets its own Vercel preview URL.
- Branch order: scaffold (tokens, fixtures, shell) → PDP → gallery → nutrition modal → grid + filters → support banner. Variant 2 branches only after Variant 1 is approved.
- The merged demo is the stable link shared with the client. Put its QR code on the Figma cover frame for phone testing.

---

## Framing (for the README)

> Reference implementation and interactive spec for S8. Structured to mirror a Shopify section for conversion to Liquid. Not a production build — no cart, checkout, account, or search. Product data and images are committed fixtures pulled from the live store for realism.
