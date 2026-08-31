# Farmers Juice PDP — Component Inventory

Maps every component in the build to its Figma node ID(s) and required states. This is the authoritative source for the build — where a Figma layer name is generic (`Frame 39485`), the semantic name here governs. Fetch designs by node ID with the Figma connector; screenshots supplement.

- **File key:** `MIPsDGloRqmDcn7QXsdWwZ`
- **Source section (canonical):** `product-page-section`, node `2186:162` (on its own page)
- **Variant in scope now:** Thumbnail carousel only. Bullet carousel is a later branch.
- **Desktop:** 1280px breakpoint (client-confirmed); design frame 1440, content ~1184, gutters 128.
- **Mobile:** frames drawn at 402px.
- **Tablet:** no tablet frame exists — interpolate from desktop grid collapse (assumption, noted).

---

## Top-level frames

| Screen | Desktop node | Mobile node |
|---|---|---|
| PDP (thumbnail carousel) | `2186:163` | `2186:1803` |
| PDP + nutrition modal open | `2186:1177` | `2186:2483` |
| PDP + nutrition zoom (expanded) | `2186:1488` | `2186:2825` |

---

## Sections & components

### 1. Global nav / header
- **Desktop:** `2186:313` (`nav-desktop`) — logo `2186:329`, Explore / Shop Now / Cart (0) / Login.
- **Mobile:** `2186:1943` (`nav-mobile`) — hamburger, centered logo, cart.
- **States:** default only. Links inert (no navigation targets). Mobile hamburger: static (menu drawer out of scope unless you say otherwise).
- **Note:** Cart shows "(0)" and is inert — no cart exists.

### 2. Hero — gallery (THUMBNAIL VARIANT)
- **Desktop:** `2191:4518` (`carousel`) → thumbnail rail `2191:4519` (7 thumbnails `2191:4523`–`4529`, up/down arrows `2191:4520`/`4530`), main viewer `2191:4532` (`image-viewer`).
- **Mobile:** `2186:3692` (`product-image/thumbnail`) → preview `2186:3693`, horizontal thumb strip `2186:3694` (7 thumbs).
- **Interactive:** clicking a thumbnail changes the main image. Desktop arrows page the thumb rail. Mobile thumbs scroll horizontally.
- **States:** thumbnail default + selected/active; main image per selection. Arrow disabled state at rail ends (desktop).
- **Image ratio:** 826×994 (~1:1.2). Budget mobile fold accordingly.

### 3. Hero — buy box
Desktop container `2186:206`; mobile container `2186:1821`. Sub-parts:

- **Product title + rating** — desktop `2186:207` (rating `2186:208`: 4.9, 5 stars, "(1,003)"). Mobile `2186:1829`.
- **Category dropdown** ("select box") — desktop `2186:200` (`juice-category-drop-down`); mobile `2186:1823` (`Dropdown`).
  - **Interactive:** opens to reveal other products. **Visual only — selecting does not navigate.**
  - **States:** closed, open. Option hover/selected inside the open menu.
- **Option selectors** (Select Type / Size / Flavors — the "under 1/2/3" button rows) — desktop group `2186:261` (rows `2186:262`, `2186:269`, `2186:282`); mobile group `2186:1883`.
  - **Interactive:** buttons 1, 2, 3 work (selectable, single-select per row).
  - **States:** default, hover, selected, focus-visible.
- **Subscription / delivery selector** — desktop `2186:289`; mobile `2186:1911`. Carry over as designed; selection can be static if it complicates things (confirm if you want it live).
- **Total price** — desktop `2186:297`; mobile `2186:1919`.
- **CTAs** — desktop `2186:300` (`proceed to checkout` `2186:301`, `Buy with ShopPay` `2186:303`); mobile `2186:1923`.
  - **Inert by design:** rendered, styled, hover state, but do nothing.
- **Mobile note:** buy box is long — a sticky mobile add-to-cart is expected given the fold math. Flag to confirm with the design.

### 4. Menu & nutrition-facts trigger
- Desktop `2191:4534` (`menu-and nutritional-facts-button`) and breadcrumb-style `2186:1182`; mobile `2186:1817` / `2186:2497`.
- **Interactive:** opens the nutrition modal.
- **States:** default, hover, focus-visible.

### 5. Nutrition facts modal — LAYERED STATE MACHINE
Desktop modal `2186:1456` (`Frame 39066`, the modal wrapper over scrim `2186:1455`); grid `2186:1477` (8 images `2186:1478`–`1485`); filter row `2186:1458`; close `2186:1486` (`vaadin:close`).
Desktop zoom (expanded) frame `2186:1488` — enlarged image `2186:1799`, close `2186:1800`, back button `2186:1802`.
Mobile modal `2186:2798`; grid `2186:2819` (3 images); close `2186:2823`. Mobile zoom `2186:2825` — enlarged `2186:3167`, back `2186:3168`, close `2186:3169`.

- **Behaviour — three states, navigated as a stack. X / Back / Escape / backdrop each pop exactly ONE level:**
  - `closed → (trigger) → modal open → (click image) → zoom open`
  - `zoom open → (X/Back/Esc/backdrop) → modal open → (X/Back/Esc/backdrop) → closed`
- Opening modal: scrim dims page, page scroll locks, focus moves into modal and is trapped.
- Zoom stacks on top of the modal (modal stays mounted underneath).
- From zoom, X/Back returns to the still-open modal — never closes everything at once.
- On full close, restore focus to the trigger.
- **Content:** simple image viewer. Grid images are **placeholders** (currently product photos named `1_Greens_PP_826x994 …`); real nutrition assets to be supplied later. Build as a generic image grid + zoom so swapping images is trivial.
- **Filter row** at top of modal (`green juices / fiber / immunity / smoothies / electrolytes / shots`): visual filter of the image grid. Confirm whether it filters or is decorative — default: filters the grid.

### 6. Below-the-fold product grid + filters
- **Filter bar:** desktop `2186:3883` (`filters`) — tabs green juices / fiber / immunity / smoothies / electrolytes / shots (`2186:3884`–`3901`). Mobile `2186:3709`.
  - **Interactive:** clicking a tab filters the grid. Single active tab.
  - **States:** default, hover, active/selected, focus-visible.
- **Grid:** desktop `2186:3902` (`Frame 39392`) — 5×2 card grid. Mobile `2186:3728` (`Frame 39480`) — vertical rows.
- **Juice card:** desktop instance `2186:3903` (`juice-card`); mobile row `2186:3729` (`Mobile`).
  - Parts: image, NEW tag (`Frame 39250` — sometimes `hidden`), title, plant count, ingredients.
  - **Interactive:** none — **clicking a card does nothing** (no product pages).
  - **States:** default; NEW-tag present/absent (respect Figma `hidden` flags per card); varying ingredient length (cards differ in height — see note).
  - **Card height note:** ingredient lists vary (6–12 items); cards are uneven by design. Match the Figma; don't force equal heights unless the design does.
- **Desktop layout divergence:** Loom asked for the vertical format on desktop too; the design uses a card grid at 1280. Build to the design (grid). Flagged for Junaid, not a build decision.

### 7. Juice-benefits row ("why try our juices?")
- Desktop `2186:4233` (`juice-benefits`) — 4 benefit items (`2186:4236`–`4254`). Mobile `2186:2260` (`Frame 39503`) — 3 items.
- **Desktop shows 4, mobile shows 3** — matches the design; carry as-is. (Earlier draft had a 5/3 split; this section is 4/3.) Static.

### 8. Customer-support banner / call badge
- Desktop appears within the gallery column `2191:4538` (`call-button`); mobile standalone `2186:1933` (`call-badge`).
- Phone "(213) 805-5544", "Need help with your order?" copy.
- **Static.** Phone link may be a `tel:` href (safe, not navigation).

---

## Build order (Variant 1 — thumbnail)
1. `chore/scaffold` — tokens.css, fonts, product fixtures, page shell, header/footer chrome
2. `feat/pdp-hero` — gallery (thumbnail) + buy box, desktop + mobile
3. `feat/nutrition-modal` — modal + zoom, layered state machine
4. `feat/product-grid` — grid + filter tabs (functional filtering)
5. `feat/support-banner` + benefits row
Each PR → its own Vercel preview. Merge → stable demo link → QR on Figma cover frame.

---

## Open items to confirm (don't assume at build time)
- Sticky mobile add-to-cart: expected from fold math — confirm with design.
- Subscription selector: live or static?
- Nutrition modal filter row: functional or decorative?
- Tablet behaviour: interpolated from desktop (assumption).
- Real nutrition-facts images: pending from client; placeholders until then.
