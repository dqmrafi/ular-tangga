# Multiplayer Implementation State

> Recovery document. Update this file in every checkpoint commit. Treat the latest committed version as the source of truth when resuming after a context loss.

## Current checkpoint

- **Checkpoint:** 4 — Public rooms and Quick Join
- **Status:** Implementation committed; runtime validation pending Supabase project
- **Working branch:** `feature/supabase-multiplayer`
- **Repository:** https://github.com/dqmrafi/ular-tangga
- **Base branch:** `main`
- **Checkpoint 0 commit:** `76e71e67233116936f8c27b4c6c5241efffb275f`
- **Checkpoint 1 commit:** `5e55393291dc70fa1535900339a6b8ef4c91253f`
- **Current checkpoint commit:** `1b2461cb0c60958763cc0f1b76520dde3a93c35c`
- **Application code changed:** Yes — Supabase foundation and private-room UI integration.
- **Tests run:** No runtime tests. No Supabase project credentials/config are available in the repository.

## Goal and scope

Implement anonymous multiplayer rooms for Ular Tangga using the existing static frontend and Supabase. Support private room creation/invite-code join, public room creation/Quick Join, synchronized lobby state, and synchronized gameplay.

Out of scope: user accounts/profile/shop/inventory, friends/chat/rankings, and a custom backend server.

## Repository and engine contracts

See the verified source-flow analysis and integration implications in `MULTIPLAYER_PLAN.md`. Key facts: `room.html` currently simulates online behavior; `RoomFlow.launch(cfg)` stores `ut-room` before navigation; gameplay state is closure-private inside `game/gameplay.html`; `doRoll()` and `playTurn()` are the central authoritative engine path.

## Architecture decisions

1. Vercel serves static files; no Vercel Function is required.
2. Supabase Postgres stores durable room/game snapshots.
3. Supabase Realtime provides row-change notifications and Presence.
4. Anonymous Supabase Auth provides an auth UUID without a registration UI; no profile/shop integration.
5. Browser uses only the public anon/publishable key. Never expose service_role.
6. Mutations use Postgres RPC functions with row locking and member/host validation.
7. Host-authoritative game simulation remains the intended prototype model.

## Checkpoint history

| Checkpoint | Description | Status | Commit |
|---|---|---|---|
| 0 | Planning docs and branch baseline | Complete | `76e71e67233116936f8c27b4c6c5241efffb275f` |
| 1 | Trace room/game contracts | Complete | `5e55393291dc70fa1535900339a6b8ef4c91253f` |
| 2 | Supabase schema/client foundation | Committed; runtime validation pending Supabase project | `1040e240d5b6a94523a12a0ba5fb29033221da05` |
| 3 | Private room lifecycle | Committed; runtime validation pending | `5c7cbbd8df3e727c583f85c36bd188f21daa7399` |
| 4 | Public rooms and Quick Join | Committed; runtime validation pending | `1b2461cb0c60958763cc0f1b76520dde3a93c35c` |
| 5 | Realtime lobby | Not started | — |
| 6 | Gameplay synchronization | Not started | — |
| 7 | Hardening and deployment | Not started | — |

## Checkpoint 4 changes

- `game/assets/js/multiplayer/room-service.js`: visibility update and atomic Quick Join wrappers.
- `supabase/migrations/202611050001_multiplayer.sql`: host-only `set_game_room_visibility` RPC. Existing `quick_join_game_room` uses row locking and `SKIP LOCKED`.
- `game/room.html`: ROOM ACCESS modal controls persisted private/public visibility; friend/demo invitation UI is hidden and replaced by room-code/link sharing.
- `game/mode.html`: online room tile offers Create Solo/Team and Quick Join Solo/Team. Quick Join joins through RPC, then opens the existing room page.
- `supabase/README.md`: public room setup/behavior notes.

## Checkpoint 3 changes

- `game/assets/js/multiplayer/room-service.js`: create/join/ready/leave RPC calls and room-row Realtime + Presence subscription.
- `game/room.html`: online mode creates private rooms or joins by invite code through Supabase; roster/readiness render from backend rows; fake guest readiness/start timers are removed from the active online flow; host empty slots share a room link. Local VS Computer/hot-seat setup remains local.

## Checkpoint 2 changes

- `supabase/migrations/202611050001_multiplayer.sql`: `game_rooms` schema, indexes, RLS select policy, anonymous-auth RPCs for create/join/Quick Join/ready/leave/start/game-state update, revision conflict guard, and Realtime publication setup.
- `game/assets/js/multiplayer/config.example.js`: public URL/key template.
- `game/assets/js/multiplayer/client.js`: lazy Supabase JS v2 client bootstrap and anonymous sign-in helper.
- `supabase/README.md`: Supabase project, Anonymous Auth, SQL, and static deployment setup.
- `.gitignore`: excludes local `config.js` so local public project configuration is not accidentally committed.

No room UI, gameplay engine, player-data, or shop/profile files have been modified in this checkpoint.

## Validation log

- Reviewed room integration anchors and matched client RPC names to the migration.
- Follow-up source review found the initial online render can run before the async room request returns; added a null-player guard to the room readiness check/render path.
- Static source review only; no browser/Supabase runtime validation is possible without a configured Supabase project.
- Re-read the existing room flow, gameplay bootstrap, turn engine, and finish path.
- Reviewed the migration and client bootstrap statically.
- Confirmed no service-role key or real project credentials are included.
- Not yet run against Supabase: project URL/key and Supabase project are not provisioned in this repository context.
- No browser test/build was run.

## Known limitations / risks

- Runtime SQL validation and anonymous sign-in require a real Supabase project with Anonymous Auth enabled.
- This schema deliberately stores the roster in JSONB for a minimal prototype. Revisit only if concurrency/query requirements require normalization.
- The SQL RPCs require review/test against Supabase's deployed Postgres version and role grants before production use.
- Anonymous Auth is abuseable without rate limits/CAPTCHA; this is a prototype identity model, not verified identity.
- Room expiry/cleanup is not implemented yet.
- Realtime publication may need manual enablement in the Supabase dashboard if the migration role cannot alter publication.
- The browser SDK is loaded from esm.sh at runtime; a later hardening pass may pin/version-host the dependency locally if desired.

## Exact next action

Checkpoint 5: implement realtime lobby lifecycle beyond basic row refresh: host start RPC integration, guest transition to gameplay, team assignment/validation, host departure/reconnect behavior, and reliable subscription cleanup. Validate public/private lobby with multiple browsers when Supabase project credentials are configured.
