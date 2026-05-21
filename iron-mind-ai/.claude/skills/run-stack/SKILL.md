---
name: run-stack
description: Boot or restart the full Iron Mind AI local dev stack — PostgreSQL, NestJS backend (:4001), and the Expo dev server. Use when the user wants to start the app, bring the environment up after a laptop restart, or restart a hung backend.
disable-model-invocation: true
---

# Run the Iron Mind AI stack

Bring up the local environment in order. Run each step, confirm it started, then move on.

## 1. PostgreSQL (binary install, not a Windows service)

```powershell
& "D:\postgresql-18.3-2-windows-x64-binaries\pgsql\bin\pg_ctl.exe" -D "D:\postgresql-18.3-2-windows-x64-binaries\pgsql\data" -l "D:\postgresql-18.3-2-windows-x64-binaries\pgsql\logfile.log" start
```
If it reports "another server might be running" / already started — Postgres is up. DB: iron_mind_ai, user postgres.

## 2. Backend — NestJS on port 4001

```powershell
cd D:\iron\irond_mind_ai\iron-mind-ai\backend
npx nest start
```
Use run_in_background: true. Reads backend/.env. If Prisma client is stale after a schema change, run `npx prisma generate` first; EPERM means a previous Nest holds the DLL — stop it and retry.

## 3. Mobile — Expo dev server

- iPhone (Expo Go on LAN):
```powershell
cd D:\iron\irond_mind_ai\iron-mind-ai\mobile
$env:EXPO_PUBLIC_API_URL = 'http://192.168.1.6:4001'
npx expo start
```
- Web (screenshots / quick checks):
```powershell
cd D:\iron\irond_mind_ai\iron-mind-ai\mobile
$env:EXPO_PUBLIC_API_URL = 'http://localhost:4001'
npx expo start --web --port 8090
```

## Notes
- Demo login: user@ironmind.local / user12345.
- Verify backend: curl http://localhost:4001/ returns the hello string.
- Reseed: cd backend; npm run db:seed.