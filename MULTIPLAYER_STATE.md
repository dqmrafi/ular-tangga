# Multiplayer Implementation State

> Recovery document. Update this file in every checkpoint commit. Treat the latest committed version as the source of truth when resuming after a context loss.

## Current checkpoint

- **Checkpoint:** 0 — Planning and repository baseline
- **Status:** Complete
- **Working branch:** `feature/supabase-multiplayer`
- **Repository:** https://github.com/dqmrafi/ular-tangga
- **Base branch:** `main`
- **Base commit:** `5178a7bae911ed16a638db32e019d4655de83767`
- **Current checkpoint commit:** pending
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
| 0 | Planning docs and branch baseline | In progress until commit verified | Pending |
| 1 | Trace room/game contracts | Not started | — |
| 2 | Supabase schema/client foundation | Not started | — |
| 3 | Private room lifecycle | Not started | — |
| 4 | Public rooms and Quick Join | Not started | — |
| 5 | Realtime lobby | Not started | — |
| 6 | Gameplay synchronization | Not started | — |
| 7 | Hardening and deployment | Not started | — |

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

Start Checkpoint 1: inspect the complete source flow for `game/room.html`, `game/assets/js/room-flow.js`, `game/assets/js/game-integration.js`, `game/gameplay/`, and the gameplay entry point. Trace room configuration into gameplay, turn/dice/movement updates, and finish handling. Then update this state file with verified contracts and commit Checkpoint 1 before implementing Supabase.
