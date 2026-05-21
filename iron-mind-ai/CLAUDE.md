# Iron Mind AI

Bilingual (RU/EN) fitness/gym app. Monorepo with two workspaces:

- `backend/` — NestJS 11 + Prisma 6 + PostgreSQL. JWT auth, REST API on **:4001**.
- `mobile/` — Expo (React Native 0.81, RN Web) + Zustand + local SQLite. TypeScript.

## Running locally

PostgreSQL is a binary install (not a Windows service). Full boot sequence lives in the **`/run-stack`** skill. Quick reference:

```powershell
# 1. Postgres
& "D:\postgresql-18.3-2-windows-x64-binaries\pgsql\bin\pg_ctl.exe" -D "D:\...\data" -l "D:\...\logfile.log" start
# 2. Backend (:4001)
cd backend; npx nest start
# 3. Mobile
cd mobile; $env:EXPO_PUBLIC_API_URL='http://localhost:4001'; npx expo start --web --port 8090
```

Demo login: `user@ironmind.local` / `user12345`. DB: `iron_mind_ai`.

## Backend conventions

- Modules under `backend/src/<feature>/` (auth, users, programs, workouts, nutrition, measurements, chat, stats, admin, coach, onboarding, achievements, schedule, ai). Each has controller + service; DTOs in `dto/` with `class-validator`.
- All feature endpoints are behind `JwtGuard`; `/onboarding/preview` and `/ai/recommendation` are public.
- Prisma schema: `backend/prisma/schema.prisma`. **Never edit migrations by hand** — use `npm run db:migrate` (dev) / `npm run db:generate`. Seed: `npm run db:seed`.
- AI features use `@anthropic-ai/sdk` behind `ANTHROPIC_API_KEY`, but the project runs **rule-based fallback by default** (no paid API key). Keep new AI features behind that fallback.
- Lint/format: `npm run lint`, `npm run format` (Prettier: `singleQuote`, `trailingComma: all`).
- `.env` holds DATABASE_URL + JWT secret and is git-ignored — do not commit or edit it via tooling.

## Mobile conventions

- Screens in `mobile/src/screens/`, reusable UI in `mobile/src/components/`, Zustand stores in `mobile/src/store/` (most persisted via AsyncStorage).
- Navigation: `mobile/src/navigation/` — 5 bottom tabs (Home/Programs/AI/Analytics/Profile) + a RootStack for the rest.
- API client: `mobile/src/api/client.ts` — typed wrappers (`api.programs.*`, `api.workouts.*`, etc.); base URL from `EXPO_PUBLIC_API_URL`.
- **i18n is mandatory.** All user-facing text goes through `t('key')` from `mobile/src/i18n/index.ts`, with matching keys in both `ru` and `en`. Never hardcode Cyrillic in screens/components — that's the project's most common bug. Run the **`/i18n-audit`** skill to catch regressions. Legitimate Cyrillic content lives only in `src/data/` (supplements, foods).
- Gamification/economy (leaves, shop, daily wheel, chest, friends, duels, challenges) is currently **local-only / mock** (no backend sync, no real payments).

## Status / roadmap

Living progress notes are kept in Claude memory (`MEMORY.md` → `project-iron-mind-progress`). Notable unfinished pieces: backend endpoints for friends/duels/program-sharing, real HealthKit/Health Connect sync, full EN supplement DB, removal of remaining hardcoded strings.
