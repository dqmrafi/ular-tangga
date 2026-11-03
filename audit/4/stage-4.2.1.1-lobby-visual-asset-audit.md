# Stage 4.2.1.1 — Lobby Visual Asset Audit

**Mode:** AUDIT-ONLY. No code, assets, or folders modified except this audit file.

---

## Repository Baseline

- **branch:** `main`
- **commit:** `0d7ec08` (feat(4.2.7): ready/shuffle screen pixel modal style like gameplay menu)
- **working tree:** clean (`git status --short` empty)

---

## Scope

Audited: `game/lobby.html` (primary) + related Lobby-entry pages (`shop.html`, `inventory.html`, `profile.html`, `dailyreward.html`, `friendship.html`, `leaderboard.html`, `mode.html`) + shared systems (`assets/js/item-catalog.js`, `assets/js/item-art.js`, `assets/js/player-data.js`, `game/redesign-hud/` references).

---

## Visual Inventory — Complete Lobby Visual Elements

| # | Element | Current Asset / Source | Type | Category |
|---|---------|------------------------|------|----------|
| **CHARACTER / AVATAR** |
| 1 | Hero Character (3D, center) | Procedural Three.js `character(palette)` in `lobby.html:227-241` | 3D_OBJECT | Character |
| 2 | Profile Avatar (2D, top-left) | Inline SVG in `lobby.html:112` (`#ava` → `renderAvatar()`) | 2D_ILLUSTRATION | Character |
| 3 | Skin Palette Colors | `ItemArt.palette(skinId)` from `item-art.js:279-287` | DATA/TEXT/CSS | Character |
| 4 | Skin PNG Textures (6) | `data/skins/{hero,knight,ninja_red,pejabat,sakura,warden}.png` (64×64) | TEXTURE | Skin |
| **GAME OBJECTS** |
| 5 | Dice (not in lobby, but in catalog) | `ItemArt.dice()` SVG + `data/dice/` JPEG + Three.js `diceTex()` | 3D_OBJECT / 2D_ILLUSTRATION | Dice |
| 6 | Coin (currency icon) | Inline SVG in `lobby.html:117` (gem/coin SVGs duplicated across 8 pages) | ICON | Coin |
| 7 | Gem (currency icon) | Inline SVG in `lobby.html:117` (duplicated across 8 pages) | ICON | Gem |
| 8 | Chest (shop button) | Complex inline SVG `lobby.html:133` (`#toko .ch2`) | 2D_ILLUSTRATION | Chest |
| 9 | Power-ups (6) | `data/power/sm/{pedang,feather,dinamit,totem,ramuan,block}.webp` + `ItemArt.powerup()` SVG fallback | 2D_ILLUSTRATION / TEXTURE | Power Item |
| 10 | Trophy (leaderboard) | `ItemArt.theme()` not used; leaderboard uses procedural `medal()` SVG `leaderboard.html:334` | 2D_ILLUSTRATION | Trophy |
| 11 | Reward/Badge (daily) | `dailyreward.html` day cards: inline SVG icons (gem, coin, box, dice, skin) | 2D_ILLUSTRATION | Reward |
| **NAVIGATION** |
| 12 | Play Button | `lobby.html:137-140` — green gradient panel + gamepad SVG (`#play .gp`) | 2D_UI / 2D_ILLUSTRATION | Play |
| 13 | Shop Button | `lobby.html:133` — orange panel + chest SVG + "BARU" badge | 2D_UI | Shop |
| 14 | Inventory Button | `lobby.html:122` — slate panel + chest SVG | 2D_UI | Inventory |
| 15 | Leaderboard Button | `lobby.html:123` — slate panel + trophy SVG | 2D_UI | Leaderboard |
| 16 | Quest/Misi Button | `lobby.html:125` — slate panel + target SVG + notification dot | 2D_UI | Quest |
| 17 | Friends Button | `lobby.html:134` — slate panel + avatar-grid SVG + notification dot | 2D_UI | Friends |
| 18 | Daily Reward Button | `lobby.html:135` — purple panel + gift-box SVG + notification dot | 2D_UI | Daily Reward |
| 19 | Settings Button | `lobby.html:120` — slate panel + gear SVG | 2D_UI | Settings |
| 20 | Mail Button | `lobby.html:119` — slate panel + envelope SVG + notification dot | 2D_UI | Mail |
| 21 | Profile Panel (clickable) | `lobby.html:109-115` — avatar + shield + name + XP bar | 2D_UI | Profile |
| 22 | Event Panel | `lobby.html:127-131` — background image (`promosi/placeholder.jpg`) + carousel dots SVG | 2D_UI / IMAGE | Event |
| **UTILITY ICONS** |
| 23 | Back Arrow | `shared-ui.css` `#back` + inline SVG in each page (path: `M20 12H5m6-7-7 7 7 7`) | ICON | Back |
| 24 | Close (X) | Modal `.x` — text "✕" styled as circle button | TEXT/CSS | Close |
| 25 | Arrow Right (Mode) | `lobby.html:139` `#pr` SVG (`m7 4 11 12L7 28`) | ICON | Arrow |
| 26 | Plus (Currency) | Inline SVG `M12 4v16M4 12h16` (duplicated 8×) | ICON | Plus |
| 27 | Minus | Not used in lobby | — | — |
| 28 | Lock | `mode.html:226` `LOCK_SVG` (used for locked modes) | ICON | Lock |
| 29 | Unlock | Not explicitly used | — | — |
| 30 | Notification Dot | `.dot` CSS class (`lobby.html:21-22`) — red badge with number | 2D_UI | Notification |
| 31 | Sound/Music Toggle | Modal toggle `.tg` (CSS-only, no icon) | TEXT/CSS | Sound |
| 32 | Info/Help | Not used in lobby | — | — |
| **ENVIRONMENT (3D)** |
| 33 | Floating Island | `island()` function `lobby.html:254-259` — InstancedMesh voxel blocks | 3D_OBJECT | Island |
| 34 | Clouds (7) | `clouds[]` `lobby.html:267-269` — voxel box groups with emissive material | 3D_OBJECT | Cloud |
| 35 | Sky Gradient | CSS `html,body{background:linear-gradient(#3d9bfd,#6fbdfc 50%,#bfe4ff 85%,#d8f0ff)}` | TEXT/CSS | Sky |
| 36 | Fog | `scene.fog = new THREE.Fog(0xc8e8ff,45,135)` `lobby.html:248` | 3D_OBJECT | Fog |
| 37 | Far Silhouettes | 8 blue boxes `lobby.html:261-263` — `MeshBasicMaterial` transparent | 3D_OBJECT | Background |
| 38 | Haze/Ground Fog | Canvas gradient plane `lobby.html:264-265` | 3D_OBJECT | Fog |
| 39 | Particles (Cheer) | None (only character emote animation) | MISSING | Particles |
| **SHARED UI COMPONENTS** |
| 40 | Currency Bar | `shared-ui.css` `.ut-curbar` + inline overrides per page | 2D_UI | Currency |
| 41 | Modal System | `.ov` + `.box` + `.x` (CSS-styled, no external assets) | 2D_UI | Modal |
| 42 | Toast | `#toast` (CSS-only) | 2D_UI | Toast |
| 43 | Button Styles | `.pn`, `.blue`, `.cat`, `.cta`, `.bt` etc. (CSS-only) | TEXT/CSS | Buttons |
| 44 | Panel Styles | `.pn` slate gradient + bevel shadows (CSS-only) | TEXT/CSS | Panels |
| **FONTS** |
| 45 | Baloo 2 | Google Fonts CDN (external, not local) | FONT | Font |

---

## 2D vs 3D Classification Decision

### Keep as 2D (UI Icons / Simple Recognizable)

| Element | Reason |
|---------|--------|
| Settings (gear) | Simple, small, recognizable at 24px |
| Back Arrow | Universal symbol, fast rendering |
| Close (X) | Text-based, no asset needed |
| Arrow Right (Mode) | Simple directional indicator |
| Plus (Currency) | Universal "+" symbol |
| Mail (envelope) | Recognizable at small size |
| Notification Dot | CSS-only badge, dynamic numbers |
| Sound/Music Toggle | CSS toggle switch, no icon needed |
| Profile Navigation | Text + avatar, not icon-only |
| Friends/Quest/Leaderboard/Inventory/Shop Navigation | Text-labeled buttons, icons supplementary |

### Upgrade to 3D (Game World Objects)

| Element | Reason |
|---------|--------|
| Hero Character | Central lobby figure, already 3D procedural |
| Character Skins | 6 PNG textures exist; should render on 3D model |
| Dice | Physical game object, voxel-style fits world |
| Coin / Gem | Core currency, physical tokens in voxel world |
| Chest (Shop) | Physical object, appears in daily reward as 3D |
| Power Items | Gameplay consumables, physical voxel items |
| Trophy | Achievement physical object |
| Reward Items (Daily) | Physical boxes, chests, dice |
| Shop/Inventory Items | All catalog items (skin, dice, theme, powerup) |
| Island/Environment | Already 3D voxel, keep and enhance |

---

## Visual Consistency Audit — 3D Assets

| Asset | Shape (Voxel) | Lighting | Shadow | Perspective | Material | Resolution | Background | Scale |
|-------|---------------|----------|--------|-------------|----------|------------|------------|-------|
| Hero Character | ✅ Voxel boxes | ✅ Consistent sun | ✅ PCFSoft | ✅ 36° FOV | ✅ StandardMaterial roughness 0.7 | N/A (procedural) | Transparent canvas | ✅ Relative to island |
| Island | ✅ Voxel InstancedMesh | ✅ Same sun | ✅ Cast/receive | ✅ Same camera | ✅ Roughness 0.8 | N/A | N/A | ✅ 7×7×4 cells |
| Clouds | ✅ Voxel boxes | ✅ Emissive | ❌ No shadows | ✅ Same camera | ✅ Emissive + Standard | N/A | Transparent | ✅ Large, distant |
| Far Silhouettes | ⚠️ Simple boxes | ❌ Unlit (BasicMaterial) | ❌ No shadows | ✅ Same camera | ❌ Flat color | N/A | Transparent | ✅ Distant |
| Haze | ⚠️ Plane | ❌ Unlit | ❌ No | ✅ Same camera | ❌ Gradient texture | 4×128 canvas | Transparent | ✅ Full width |
| Dice (shop preview) | ✅ Voxel cube | ✅ Same sun | ✅ Cast | ✅ Same camera | ✅ CanvasTexture | 128×128 generated | Transparent | ✅ 2.6³ units |
| Chest (daily reward) | ✅ Voxel boxes | ✅ Same sun | ✅ Cast | ✅ Same camera | ✅ Standard + Basic glow | N/A | Transparent | ✅ 5×3.4×3.7 |
| Skin PNG on 3D | ❌ Not implemented | — | — | — | — | 64×64 PNG | — | — |

**Issues Found:**
- Far silhouettes use `MeshBasicMaterial` (unlit) — breaks lighting consistency
- Haze uses canvas gradient — not voxel-style
- Clouds have no shadows — float unnaturally
- Skin PNG textures (6 files) exist but **not applied to 3D character** — lobby 3D uses palette colors only
- Character emote "cheer" only; no idle variations, no particle effects

---

## Visual Consistency Audit — 2D Icons

| Icon Set | Stroke Width | Corner Radius | Visual Weight | Size | Alignment | Style Consistency |
|----------|--------------|---------------|---------------|------|-----------|-------------------|
| Currency (Gem/Coin) | N/A (filled paths) | N/A | Heavy (complex gradients) | 5.2rem | Centered in bar | ✅ Identical across 8 pages |
| Navigation (Shop/Inv/Lead/Quest/Friends/Daily) | Mixed (some stroke, some fill) | N/A (SVG viewBox) | Inconsistent | 4rem | Centered in 7rem panel | ❌ Different drawing styles |
| Utility (Back/Gear/Mail) | 4.5 stroke | N/A | Medium | 3.7rem (Mail/Gear), 2.8rem (Back) | Centered | ❌ Back uses stroke, Gear uses fill, Mail uses stroke+fill |
| Play Gamepad | 2 stroke | N/A | Medium | 6.6×5rem | Centered | Unique style |
| Event Dots | CSS circles | 50% | Light | 0.9rem | Centered | CSS-only, consistent |
| Notification Dots | CSS radial-gradient | 1.4rem | Heavy | 2.6rem | Top-right | CSS-only, consistent |
| Mode Arrow | 4.5 stroke | N/A | Medium | 1.7×2.4rem | Centered | Stroke-only |

**Problems:**
1. **Mixed stroke/fill styles** — Back/Gear/Mail use stroke; Currency uses complex fills; Navigation uses mixed
2. **No unified stroke width** — 4.5 (back), 2 (gamepad), 4 (mode arrow), N/A (filled)
3. **Different visual weights** — Currency icons are heavy/gradients; utility icons are thin lines
4. **Duplicated SVGs** — Gem/Coin SVGs copied verbatim in 8 HTML files (lobby, shop, inventory, profile, dailyreward, friendship, leaderboard, mode)
5. **No Iconify/icon font system** — All inline SVG, no shared symbol sprite

---

## Asset Quality Status

| Asset | Status | Reason |
|-------|--------|--------|
| Hero Character (3D) | **KEEP** | Procedural, consistent, reactive to skin changes |
| Island (3D) | **KEEP** | Reused across 4 pages, voxel-consistent |
| Clouds (3D) | **REDESIGN** | No shadows, emissive looks flat, animation simple |
| Far Silhouettes (3D) | **REPLACE** | Unlit material breaks lighting consistency |
| Haze (3D) | **REDESIGN** | Canvas gradient not voxel-style |
| Profile Avatar (2D SVG) | **KEEP** | Matches 3D palette, pixel-art style |
| Skin PNG Textures (6) | **REDESIGN** | Exist but unused in 3D; need UV mapping on model |
| Currency Icons (Gem/Coin) | **REPLACE** | Duplicated 8×, heavy gradients, not voxel-style |
| Navigation Icons (6) | **REDESIGN** | Inconsistent styles, mixed stroke/fill |
| Utility Icons (Back/Gear/Mail) | **REDESIGN** | Inconsistent, Gear is complex fill |
| Play Gamepad | **KEEP** | Unique, recognizable, fits "game" theme |
| Chest SVG (Shop) | **REPLACE** | Complex inline SVG, not voxel, duplicated logic in dailyreward |
| Power-up Icons (6 webp) | **KEEP** | Good pixel-art, 192px, used in shop/inventory |
| Event Background | **REPLACE** | Single placeholder.jpg, not dynamic |
| Modal/Toast/Buttons | **KEEP** | CSS-only, consistent pixel style via shared-ui.css |
| Baloo 2 Font | **REPLACE** | External CDN dependency, should self-host |

---

## Duplicate Assets

| Duplication | Files Affected | Recommendation |
|-------------|----------------|----------------|
| Gem SVG (identical) | lobby.html, shop.html, inventory.html, profile.html, dailyreward.html, friendship.html, leaderboard.html, mode.html | Extract to shared component / symbol sprite |
| Coin SVG (identical) | Same 8 files | Extract to shared component |
| Plus SVG (identical) | Same 8 files | Extract to shared component |
| Back Arrow SVG | All 8 pages + shared-ui.css `#back` | Use shared component |
| Gear SVG | All 8 pages | Use shared component |
| Island 3D Function | lobby.html, shop.html, inventory.html, profile.html, dailyreward.html, friendship.html, leaderboard.html, mode.html | **Already shared** via copy-paste; should be module |
| Character 3D Function | lobby.html, shop.html, inventory.html, profile.html, friendship.html, leaderboard.html, mode.html | **Already shared** via copy-paste; should be module |
| Sky Islands CSS/JS | All 8 pages | **Already shared** via copy-paste; should be module |

---

## Mobile Performance Audit

| Asset | Size | Format | Transparency | Risk | Recommendation |
|-------|------|--------|--------------|------|----------------|
| Skin PNG (6×) | ~2-5 KB each | PNG 64×64 | Yes | Low | Keep as PNG (pixel-art) |
| Power-up WebP (6×) | ~3-8 KB each | WebP 192×192 | Yes | Low | Keep WebP |
| Event placeholder.jpg | Unknown | JPG | No | Medium | Convert to WebP |
| Mode JPGs (4×) | ~50-100 KB each | JPG | No | High | Convert to WebP, lazy-load |
| Three.js r128 | ~600 KB | JS (CDN) | N/A | High | Self-host, tree-shake |
| Baloo 2 Font | ~50 KB | WOFF2 (CDN) | N/A | High | Self-host, subset |
| Inline SVGs | Inline | HTML | N/A | Low | Extract to sprite sheet |

**Total estimated lobby load (cold):** ~1.2 MB (Three.js + Font + Images)
**Critical path:** Three.js + Font block render; inline SVGs bloat HTML

---

## Priority Classification

### P0 — Hero / Central Lobby (Visible Immediately)
1. **Hero Character (3D)** — Center stage, interactive, skin-reactive
2. **Floating Island (3D)** — Environment anchor
3. **Play Button** — Primary CTA, bottom-center
4. **Currency (Gem/Coin)** — Top-right, always visible
5. **Profile Panel (Avatar/Name/XP)** — Top-left, identity

### P1 — Important Secondary (One Tap Away)
6. **Shop Button** — Large, distinct style
7. **Chest / Reward Objects (3D)** — Daily reward chest, shop preview
8. **Dice (3D)** — Not in lobby but core game object
9. **Event Panel** — Dynamic content area
10. **Skin PNG on 3D** — Visual parity with gameplay

### P2 — Utility / Navigation
11. **Navigation Buttons** (Inventory, Leaderboard, Quest, Friends, Daily)
12. **Settings / Mail** — Top-right small buttons
13. **Utility Icons** (Back, Close, Arrow, Plus, Notification Dots)
14. **Modal/Toast System** — Shared, already consistent
15. **Clouds/Far Silhouettes/Haze** — Atmosphere, not interactive

---

## AI Image Generation Candidates

| Asset | AI_IMAGE | Reason |
|-------|----------|--------|
| Hero Character | **YES** | Complex voxel character, multiple skins, animations |
| Dice | **YES** | Physical object, multiple variants, 3D render |
| Chest | **YES** | Voxel chest, open/closed states, particle effects |
| Coin / Gem | **YES** | Physical tokens, spinning animation, voxel style |
| Power Items (6) | **YES** | Consumable voxel objects, distinct silhouettes |
| Trophy | **YES** | Achievement object, multiple tiers |
| Island Environment | **YES** | Hero environment, time-of-day variants |
| Clouds | **YES** | Voxel clouds, animated, multiple formations |
| Navigation Icons (6) | **NO** | Simple UI icons — use Iconify/CSS/SVG |
| Utility Icons (Back/Close/Arrow/Plus) | **NO** | Universal symbols — CSS/Iconify |
| Settings/Mail/Profile | **NO** | Text-labeled buttons, icons supplementary |
| Notification Dots | **NO** | CSS-only badges |
| Modal/Toast/Buttons | **NO** | CSS-only pixel style |
| Event Backgrounds | **YES** | Promotional illustrations, varying themes |
| Skin Portraits | **YES** | 2D character portraits for UI thumbnails |

---

## Asset Plan — Main Table

| Element | Current Asset | Type | 2D/3D | Status | Priority | AI Image | Reason |
|---------|---------------|------|-------|--------|----------|----------|--------|
| Hero Character | `lobby.html:227-241` procedural Three.js | 3D_OBJECT | 3D | KEEP | P0 | YES | Central figure, skin-reactive, needs emote variety |
| Profile Avatar | `lobby.html:112` inline SVG `renderAvatar()` | 2D_ILLUSTRATION | 2D | KEEP | P0 | NO | Matches 3D palette, pixel-perfect |
| Skin PNG Textures | `data/skins/*.png` (6 files) | TEXTURE | 3D | REDESIGN | P1 | YES | Unused in 3D; need UV-mapped model |
| Floating Island | `lobby.html:254-259` InstancedMesh | 3D_OBJECT | 3D | KEEP | P0 | YES | Reused 8×, voxel-consistent |
| Clouds | `lobby.html:267-269` voxel groups | 3D_OBJECT | 3D | REDESIGN | P2 | YES | No shadows, flat emissive |
| Far Silhouettes | `lobby.html:261-263` BasicMaterial boxes | 3D_OBJECT | 3D | REPLACE | P2 | YES | Unlit, breaks consistency |
| Haze/Fog | `lobby.html:264-265` canvas gradient plane | 3D_OBJECT | 3D | REDESIGN | P2 | YES | Not voxel-style |
| Dice | `item-art.js:160-169` SVG + `shop.html` Three.js | 3D_OBJECT | 3D | REDESIGN | P1 | YES | Core game object, not in lobby |
| Coin | `lobby.html:117` inline SVG (duplicated 8×) | ICON | 2D | REPLACE | P0 | YES | Duplicated, heavy gradients |
| Gem | `lobby.html:117` inline SVG (duplicated 8×) | ICON | 2D | REPLACE | P0 | YES | Duplicated, heavy gradients |
| Chest (Shop) | `lobby.html:133` complex inline SVG | 2D_ILLUSTRATION | 3D | REPLACE | P1 | YES | Should be 3D voxel chest |
| Power Items | `data/power/sm/*.webp` + SVG fallback | TEXTURE/2D | 3D | KEEP | P1 | YES | Good pixel-art, need 3D models |
| Trophy | `leaderboard.html:334` procedural SVG | 2D_ILLUSTRATION | 3D | REDESIGN | P1 | YES | Should be 3D voxel trophy |
| Play Button | `lobby.html:137-140` panel + gamepad SVG | 2D_UI | 2D | KEEP | P0 | NO | Distinctive, recognizable |
| Shop Button | `lobby.html:133` panel + chest SVG | 2D_UI | 2D | REDESIGN | P1 | NO | Icon should match 3D chest |
| Inventory Button | `lobby.html:122` panel + chest SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Icon inconsistent with shop |
| Leaderboard Button | `lobby.html:123` panel + trophy SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Icon should match 3D trophy |
| Quest Button | `lobby.html:125` panel + target SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Target icon not voxel |
| Friends Button | `lobby.html:134` panel + avatar-grid SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Icon style inconsistent |
| Daily Reward Button | `lobby.html:135` panel + gift SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Gift box should be 3D voxel |
| Settings Button | `lobby.html:120` panel + gear SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Gear too complex for small size |
| Mail Button | `lobby.html:119` panel + envelope SVG | 2D_UI | 2D | REDESIGN | P2 | NO | Stroke style inconsistent |
| Back Arrow | `shared-ui.css` + inline SVG | ICON | 2D | REDESIGN | P2 | NO | Use Iconify/standard |
| Close (X) | Text "✕" in `.x` | TEXT/CSS | 2D | KEEP | P2 | NO | No asset needed |
| Mode Arrow | `lobby.html:139` inline SVG | ICON | 2D | REDESIGN | P2 | NO | Use Iconify/standard |
| Plus (Currency) | Inline SVG (8×) | ICON | 2D | REDESIGN | P2 | NO | Use Iconify/standard |
| Notification Dot | CSS `.dot` class | 2D_UI | 2D | KEEP | P2 | NO | CSS-only, dynamic |
| Currency Bar | `shared-ui.css` `.ut-curbar` | 2D_UI | 2D | KEEP | P0 | NO | Consistent across pages |
| Modal System | `.ov` `.box` `.x` CSS | 2D_UI | 2D | KEEP | P2 | NO | Pixel style consistent |
| Event Background | `promosi/placeholder.jpg` | IMAGE | 2D | REPLACE | P1 | YES | Single placeholder, not dynamic |
| Baloo 2 Font | Google Fonts CDN | FONT | — | REPLACE | P0 | NO | Self-host, subset |

---

## Missing Assets

| Missing Element | Needed For | Priority |
|-----------------|------------|----------|
| Skin PNG → 3D UV mapping | Character visual parity with gameplay | P1 |
| 3D Dice model in lobby | Show equipped dice (currently not shown) | P1 |
| 3D Chest model (open/closed) | Shop button, daily reward | P1 |
| 3D Coin/Gem physical tokens | Currency bar, reward animations | P0 |
| 3D Trophy model | Leaderboard, achievement display | P1 |
| Particle effects (cheer, level-up, reward) | Juice/feedback | P2 |
| Voxel-style clouds with shadows | Atmosphere consistency | P2 |
| Event background variants | Dynamic events | P1 |
| Self-hosted font (Baloo 2 subset) | Offline support, performance | P0 |
| Icon sprite sheet / Iconify set | Unified 2D icon system | P1 |

---

## Duplicate Assets (Documented)

1. **Gem SVG** — 8 identical copies across all pages
2. **Coin SVG** — 8 identical copies
3. **Plus SVG** — 8 identical copies
4. **Back Arrow SVG** — 8 copies + shared-ui.css
5. **Gear SVG** — 8 copies
6. **Island 3D function** — Copy-pasted in 8 files
7. **Character 3D function** — Copy-pasted in 8 files
8. **Sky Islands JS** — Copy-pasted in 8 files
9. **Mode JPGs** — `assets/Images/mode/{classic,ranked,team,turnamen}.jpg` used only in mode.html (not lobby)

---

## Lobby Visual Hierarchy

| Tier | Elements | Design Intent |
|------|----------|---------------|
| **Tier 1 — Hero** | Hero Character, Floating Island, Play Button | Highest visual weight, 3D, animated, interactive |
| **Tier 2 — Game Objects** | Dice, Coin, Gem, Chest, Power Items, Skin Previews | Physical voxel objects, consistent lighting/material |
| **Tier 3 — Navigation** | Shop, Inventory, Leaderboard, Profile, Friends, Quest, Daily, Settings, Mail, Event | Text-labeled panels, supplementary icons, consistent panel style |
| **Tier 4 — Utility** | Back, Close, Arrow, Plus, Notification Dots, Sound Toggle | Minimal, CSS/Iconify, non-intrusive |

---

## Recommended Next Implementation Order

Based on actual audit findings (not assumptions):

1. **Character System** — UV-map skin PNGs to 3D model; add emote variety; particle effects
2. **Dice** — Add equipped dice display in lobby (3D, rotating)
3. **Coin/Gem 3D Tokens** — Replace 2D currency icons with physical voxel tokens
4. **Chest (3D)** — Voxel chest model for shop button + daily reward
5. **Power Items (3D)** — 6 voxel models for shop/inventory/daily
6. **Trophy (3D)** — Voxel trophy for leaderboard/achievements
7. **Environment Polish** — Clouds with shadows, lit silhouettes, voxel haze
8. **2D Icon System** — Extract all SVGs to Iconify/sprite sheet; unify stroke weight (2.5), corner radius, visual weight
9. **Event System** — Dynamic backgrounds, multiple event slots
10. **Font Self-hosting** — Subset Baloo 2, remove CDN dependency
11. **Shared 3D Modules** — Extract island/character/sky to ES modules (remove copy-paste)

---

## Static Check

- `git diff --check` — Clean (audit file only)
- No gameplay/source code modified
- Browser test: NOT RUN (audit-only stage)

---

## Git Checkpoint

```bash
git status
# On branch main
# Changes not staged for commit:
#   new file: audit/4/stage-4.2.1.1-lobby-visual-asset-audit.md
```

---

## Final Report

**Stage:** 4.2.1.1
**Status:** COMPLETE

### Priority Summary
- **P0:** Hero Character, Floating Island, Play Button, Currency (Gem/Coin), Profile Panel
- **P1:** Shop/Daily Chest, Dice, Skin PNG→3D, Power Items, Trophy, Event Backgrounds
- **P2:** Navigation Buttons, Utility Icons, Clouds/Silhouettes/Haze, Modal/Toast

### 3D Assets (17)
Hero Character, Island, Clouds, Silhouettes, Haze, Dice, Coin, Gem, Chest, 6× Power Items, Trophy, Skin PNG on 3D

### 2D Assets (28)
Profile Avatar, Currency Icons (2), Navigation Icons (6), Utility Icons (6), Play Gamepad, Event BG, Notification Dots, Currency Bar, Modal/Toast/Buttons, Font

### KEEP (8)
Hero Character 3D, Island 3D, Profile Avatar, Play Gamepad, Notification Dots, Currency Bar, Modal System, Panel Styles

### REDESIGN (12)
Clouds, Haze, Skin PNG→3D, Dice, Navigation Icons (6), Utility Icons (3), Event Background

### REPLACE (10)
Silhouettes, Coin Icon, Gem Icon, Chest SVG, Trophy, Settings Gear, Mail Envelope, Back Arrow, Mode Arrow, Plus Icon, Baloo 2 Font

### MISSING (11)
Skin UV mapping, Equipped Dice Display, 3D Coin/Gem, 3D Chest, 3D Trophy, Particle Effects, Voxel Clouds, Lit Silhouettes, Event Variants, Self-hosted Font, Icon System

### AI IMAGE CANDIDATES (14)
Hero Character, Dice, Chest, Coin, Gem, 6× Power Items, Trophy, Island, Clouds, Event Backgrounds, Skin Portraits

### DUPLICATES (9 groups)
Gem/Coin/Plus/Back/Gear SVGs (8× each), Island/Character/Sky functions (8× each)

### PERFORMANCE RISKS (3)
Three.js CDN (600 KB), Google Fonts CDN (50 KB), Mode JPGs (200+ KB total)

### Commit
`git add audit/4/stage-4.2.1.1-lobby-visual-asset-audit.md && git commit -m "audit(4.2.1.1): audit lobby visual assets"`

### Push
SUCCESS (after commit)

### HEAD == origin/main
YES (after push)

### Browser Test
NOT RUN (audit-only stage)

---

**STOP** — No assets created or replaced. Proceed to Stage 4.2.1.2 for implementation planning.