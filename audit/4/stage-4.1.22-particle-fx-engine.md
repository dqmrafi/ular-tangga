# Stage 4.1.22 — Lightweight 2D Particle FX Engine

## Scope
Fondasi engine partikel 2D (DOM + CSS) yang reusable. Belum ada efek spesifik (firework, creeper, enderman, power FX). Gameplay tidak diubah.

## Existing FX Audit
- `game/gameplay/fx.js` (`UT.GameplayFX`): FX **3D Three.js** (konfeti 3D, sparkle peti), dipanggil dari loop gameplay. Berbeda domain; **tidak diubah dan tidak dihapus**.
- `game/gameplay/feedback.js`: kartu hadiah/serangan (DOM `#puCard`), bukan particle system.
- CSS animasi Power (`pfx-*`) di `gameplay.html`: tidak disentuh.
- Tidak ada particle system 2D / `#fx-layer` sebelumnya, jadi tidak ada duplikasi.

## Implementation
- `UT.ParticleFX` (alias `window.particleFX`): `burstAt(x, y, opts)`, `burstFromElement(el, opts)`, `clear()`, `configure({maxParticles, maxBurst})`.
- `#fx-layer` dibuat lazy sekali (reuse bila sudah ada), `position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:60`.
- Partikel = `<span class="fx-particle">`, variabel CSS `--fx-x/-y/-size/-dur/-scale/-rot/-color/-delay`. Tidak ada logika `type === ...`.

## Files Changed
- NEW `game/gameplay/particle-fx.js`
- NEW `game/gameplay/particle-fx.css`
- `game/gameplay.html`: +1 `<link>` stylesheet, +1 `<script>` (setelah `fx.js`). Tanpa perubahan logika.
- NEW `audit/4/stage-4.1.22-particle-fx-engine.md`

## Performance Constraints
- Animasi hanya `transform` + `opacity`; satu `@keyframes` (`fx-particle-move`), 1 iterasi, tanpa infinite.
- Tanpa blur/filter/box-shadow/backdrop-filter. Tanpa rAF, setInterval, setTimeout, polling.
- Batas: default 12/burst, maks 20/burst, maks 60 partikel di layar (dapat di-`configure`, plafon 30/120). Hitungan disinkronkan dari DOM nyata (tidak bisa drift).
- `getBoundingClientRect()` hanya saat `burstFromElement` dipanggil.

## Reduced Motion
JS: `matchMedia('(prefers-reduced-motion: reduce)')` → `burstAt` return 0 tanpa membuat partikel/layer. CSS: `#fx-layer{display:none}` sebagai lapis kedua.

## Cleanup
Satu listener `animationend` (event delegation) pada `#fx-layer`, terpasang sekali; menghapus partikel. Tidak ada listener/timer per partikel.

## Regression
Hanya 2 sisipan di `gameplay.html` (link CSS, script tag). `p.shield=true`, identity `totem`, `renderChips()`, feedback timestamp, dan reduced-motion Power tidak disentuh. Engine tidak dipanggil dari mana pun (belum terhubung ke Sword/TNT/Totem/dll).

## Static Checks
- `node --check game/gameplay/particle-fx.js` OK.
- Uji fungsional jsdom (bukan browser): burst 12 → 12 partikel; count 500 → dibatasi 20; total dibatasi 60; 1 layer; `animationend` menghapus 1 partikel; input NaN/elemen null → 0; `clear()` → 0; reduced-motion → 0 partikel & tidak ada layer.
- CSS: keyframes valid, kelas `fx-particle/fx-round/fx-bar` tersedia, tidak ada `infinite`, tidak ada properti layout dianimasikan.

## Manual Browser Test
NOT RUN — requires user/browser testing.

## Result
READY FOR MANUAL TEST
