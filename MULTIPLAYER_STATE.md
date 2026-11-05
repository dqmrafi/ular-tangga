# Multiplayer Implementation State

> Recovery document. Update this file in every checkpoint commit. Treat the latest committed version as the source of truth when resuming after a context loss.

## Current checkpoint

- **Checkpoint:** 1 — Trace existing room/game contracts
- **Status:** Complete
- **Working branch:** `feature/supabase-multiplayer`
- **Repository:** https://github.com/dqmrafi/ular-tangga
- **Base branch:** `main`
- **Base commit:** `5178a7bae911ed16a638db32e019d4655de83767`
- **Current checkpoint commit:** pending (this checkpoint commit)
- **Application code changed:** No
- **Tests run:** None (intentionally deferred until after push, per project workflow)

## Goal and scope

Implement anonymous multiplayer rooms for Ular Tangga using the existing static frontend and Supabase. Support private room creation/invite-code join, public room creation/Quick Join, synchronized lobby state, and synchronized gameplay.

Out of scope: user accounts/profile/shop/inventory, friends/chat/rankings, and a custom backend server.

## Repository baseline reviewed

The repository is a static HTML/CSS/JavaScript application. Existing relevant paths:

- `game/lobby.html`
- `game/room.html`
- `game/gameplay.html`
- `game/assets/js/room-flow.js`
- `game/assets/js/player-data.js`
- `game/assets/js/game-integration.js`
- `game/gameplay/`

The current room UI includes online/offline, private/public, room code/invite, player list, ready, and start concepts. The online behavior is currently simulated with browser-local state, demo data, and timers. Separate browsers do not currently share room or gameplay state.

Keep `player-data.js` and unrelated profile/shop behavior untouched. Multiplayer anonymous identity must be a separate concern.

## Architecture decisions

1. Vercel serves the static frontend; it does not need a Lambda/Function for this design.
2. Supabase Postgres stores durable room and game snapshots.
3. Supabase Realtime provides presence and update delivery.
4. A single `game_rooms` table with JSONB player/game snapshots is the starting point; normalize only if the inspected game contract demonstrates a real need.
5. Use small Postgres RPCs for atomic join/Quick Join/start operations where concurrency matters.
6. Use a host-authoritative prototype for gameplay synchronization.
7. Browser uses only the Supabase anon/publishable key. Never expose service-role credentials.
8. No custom Node server, Vercel Functions, Edge Functions, Redis, or Socket.IO unless a concrete limitation justifies one.

## Checkpoint history

| Checkpoint | Description | Status | Commit |
|---|---|---|---|
| 0 | Planning docs and branch baseline | Complete | `76e71e67233116936f8c27b4c6c5241efffb275f` |
| 1 | Trace room/game contracts | Complete | Pending commit SHA |
| 2 | Supabase schema/client foundation | Not started | — |
| 3 | Private room lifecycle | Not started | — |
| 4 | Public rooms and Quick Join | Not started | — |
| 5 | Realtime lobby | Not started | — |
| 6 | Gameplay synchronization | Not started | — |
| 7 | Hardening and deployment | Not started | — |

## Verified room and gameplay contracts

### Room URL and configuration

- Room entry contract: `room.html?mode=vsc|local|online&format=solo|team&count=2..4[&role=guest&code=XXXX]`.
- `game/assets/js/room-flow.js` owns navigation, room/game session persistence, and gameplay launch.
- `RoomFlow.launch(cfg)` dispatches cancelable `game:start`, derives the gameplay mode/skin list/dice, stores `ut-config` and full `ut-room` in sessionStorage, then navigates to `gameplay.html`.
- `RoomFlow.lastRoom()` reads `ut-room`; `returnUrl()` uses it to return to the room.
- `game/assets/js/game-integration.js` normalizes owned cosmetics and writes a normalized config to `window.__utConfig`; it does not currently carry multiplayer room identity or player roster into the game engine.
- `game/room.html` owns most room UI/logic inline. It currently creates a local `S.room`, uses demo `FRIENDS`, simulates guest readiness with `guestSim()`, simulates invitation acceptance with timers, and simulates guest game start with `hostT`.

### Existing room player contract

The room UI currently uses player objects with `id`, `name`, `level`, `ready`, `team`, and `kind`; friend records may also carry `fid`. The room configuration passed to `RoomFlow.launch` contains:

- `type`, `mode`, `format`, `privacy`, `host`, `code`, `map`
- `players: [{name, team, kind}]`
- `powers`, `skin`, `frame`, `dice`

Team mode requires four players, two per team. Solo online mode is capped at four and requires at least two players. Existing room UI assumes online team count 4 and solo count 4.

### Gameplay engine contract

- `game/gameplay.html` is a 5,900+ line inline engine, not a set of isolated modules.
- Core runtime state is closure-private: `players[]`, `cur`, `busy`, `gameOver`, `gameId`, and `mode`.
- Each player has runtime fields including `idx`, `name`, `key`, `cpu`, `pos`, `sixes`, `dhp`, `hpMax`, `crystal`, `dragonReady`, `score`, `bonus`, `extra`, power flags/counts, and a Three.js `pawn` object. Pawn objects cannot be serialized.
- `startGame(mode, keys)` creates player runtime objects and pawns, initializes `cur=0`, then invokes `beginTurn()` after the ready-card flow. It currently uses the generic `PLAYER_DEFS` names, not room player names.
- `doRoll()` is the central dice entry point. It owns random/special dice resolution, animations, sixes streak, and calls `playTurn()`.
- `playTurn(p, value, gameId, bonus)` owns movement, bounce, tile effects, chest, boss encounters, and turn advancement.
- `nextTurn()` increments `cur`; `beginTurn()` updates HUD and enables roll for human players. `finishGame(p)` is the terminal transition.
- `UT.Gameplay.Core.turn` exposes only a read-only turn-order/current-player snapshot. The player array and complete game state are intentionally not exposed.
- Current local multiplayer supports all human seats taking turns in one browser; `localPlayerIdx()` is hard-coded to seat 0 only for the auto-roll feature. This must be separated from network player ownership for online mode.
- Gameplay uses random events, optional power-ups, chests, special dice, boss phases, and animations. A multiplayer snapshot must represent gameplay state, not Three.js objects or transient animation state.

### Integration implications

- Keep the game engine as the host-side simulation authority for the first multiplayer version.
- Add a narrow multiplayer bridge inside the gameplay closure to export a serializable snapshot at stable turn/state boundaries and apply snapshots on guest clients.
- Guests need to send a roll intent to the host; the host executes the existing `doRoll()` path. Guests must not independently simulate dice/movement.
- Persist the room roster and game configuration in `ut-room` before navigating each client into gameplay. The engine should apply room display names to its generated player definitions.
- Ready-card ordering is currently independently randomized and interactively selected in each browser. Online mode must either coordinate that ordering or disable the local ready-card shuffle and use a single host-selected turn order.
- Reconnect must load the latest durable snapshot and restore gameplay fields; Three.js pawns are reconstructed from the local engine and then positioned from the snapshot.
- The engine has many mid-turn side effects and modal decisions (Totem, chest rewards, boss interactions). Initial synchronization should publish committed state after a turn resolves and explicitly handle any interactive action that blocks the host. This is a major validation risk and should not be hidden by calling the feature complete prematurely.

## Changed files

For Checkpoint 0, expected additions only:

- `MULTIPLAYER_PLAN.md`
- `MULTIPLAYER_STATE.md`

No existing application files should be modified.

## Validation log

- Repository metadata checked: public repository, default branch `main`, push/admin permission available.
- Base branch head read: `5178a7bae911ed16a638db32e019d4655de83767`.
- Repository tree and relevant room/game files were inspected through GitHub.
- No local clone was made.
- No application code was changed.
- No tests/build were run.

## Known limitations / unresolved items

- Exact game-state shape and the safest integration points have not yet been fully traced.
- Room capacity and team-mode player constraints must be confirmed against existing game rules.
- Anonymous identity is a convenience identifier, not authenticated identity; security expectations must remain appropriate for a prototype.
- Presence/disconnect cleanup and host transfer policy need to be finalized during contract review.
- Supabase project URL/key and project provisioning are not yet configured in the repository.

## Exact next action

Start Checkpoint 2: add the Supabase browser client/configuration boundary, SQL schema and RPC setup, anonymous identity, and a small multiplayer service module. Keep room UI integration for the private-room lifecycle in Checkpoint 3. Before writing implementation, decide the exact anonymous-auth and RLS model; do not expose service-role credentials.
