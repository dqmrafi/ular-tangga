# Supabase setup — Ular Tangga multiplayer

## Required Supabase project settings

1. Create a Supabase project.
2. In **Authentication → Providers → Anonymous**, enable anonymous sign-ins.
3. Apply `supabase/migrations/202611050001_multiplayer.sql` in the SQL Editor (or with Supabase CLI).
4. Confirm `public.game_rooms` is enabled for Realtime. The migration attempts to add it to `supabase_realtime`; if publication permissions prevent that, enable it from Database → Publications / Realtime settings.
5. Copy `game/assets/js/multiplayer/config.example.js` to `game/assets/js/multiplayer/config.js` and replace the URL and anon/publishable key with the values from **Project Settings → API**.
6. Deploy the static site to Vercel. Since this project currently has no build pipeline, the browser config file is a static asset: put the public project URL and anon/publishable key in that file before deployment. These are public client values; database access is protected by RLS/RPC. Never use the service_role key.

## Anonymous player identity

The browser calls `supabase.auth.signInAnonymously()` on first multiplayer use. Supabase persists the anonymous session in browser storage and exposes its UUID through `auth.uid()`. No registration or profile/shop linkage is involved. Anonymous Auth must be enabled or this call will fail.

## SQL model

`game_rooms` stores the room code, host, visibility, format/capacity, player roster, room config, game snapshot, and monotonically increasing revision.

All mutations are RPC-based. RLS allows authenticated room members to read their room. The RPC functions perform row locking and host/member checks. The browser key is the anon/publishable key, not service_role.

## Notes

- Anonymous Auth users are real Supabase Auth records. Configure Supabase Auth rate limits / CAPTCHA according to expected traffic; anonymous identities can be abused at scale.
- This is not strong identity or anti-cheat. Clearing browser storage creates a new anonymous player identity.
- Room expiry/cleanup policy is not included in the first schema migration; add it after choosing the desired room lifetime.

## Public rooms and Quick Join

A room owner can switch a waiting room between private and public from **ROOM ACCESS**. Public rooms become discoverable by Quick Join; private rooms remain joinable by code. The mode selector offers Quick Join Solo and Quick Join Team. Quick Join is an atomic database RPC and joins one compatible waiting public room.
