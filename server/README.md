# AUV Backend (Express + Postgres)

REST API that replaces the frontend's `localStorage` store. Works with any
Postgres provider — Neon, Supabase (as raw Postgres), Railway, Render, etc.

## 1. Pick a free Postgres host

Recommended (all have generous free tiers, no credit card):

- **Neon** — https://neon.tech (0.5 GB, never sleeps)
- **Supabase** — https://supabase.com (500 MB, pauses after 7 days idle)
- **Railway** — https://railway.app (starter trial)

Copy the `DATABASE_URL` connection string they give you.

## 2. Configure

```bash
cd server
cp .env.example .env
# edit .env: paste DATABASE_URL, set JWT_SECRET to a long random string
npm install
```

## 3. Migrate + seed

```bash
npm run migrate
```

Creates all tables and seeds the initial developer account
(`developer` / `devpass` — change immediately in production).

## 4. Run

```bash
npm run dev     # local (auto-restart)
npm start       # production
```

Server listens on `PORT` (default 4000). Health check: `GET /health`.

## 5. Point the frontend at it

In the Lovable project root create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

For deployed frontend, use the deployed server URL.

## 6. Deploy the server

Any Node host works. Render / Railway free tiers deploy in one click:

- Build command: `npm install`
- Start command: `npm start`
- Env vars: copy everything from your local `.env`
- Root directory: `server`

## API surface

All routes are JSON. Protected routes require `Authorization: Bearer <token>`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | public | Request account (pending) |
| POST | `/auth/login` | public | Returns `{ token, user }` |
| GET  | `/auth/me` | user | Current user |
| GET  | `/db` | user | Full snapshot (frontend hydration) |
| GET  | `/users` | developer | All users |
| GET  | `/users/pending` | developer | Pending users |
| PATCH| `/users/:id/status` | developer | `{ status: 'active'\|'rejected' }` |
| GET  | `/collections/:name` | public | List items in a collection |
| POST | `/collections/:name` | admin | Create |
| PATCH| `/collections/:name/:id` | admin | Update |
| DELETE| `/collections/:name/:id` | admin | Delete |
| GET  | `/sessions` | public | Member sessions list |
| POST | `/sessions` | admin | Create session |
| PATCH| `/sessions/active` | admin | Set active session |
| GET  | `/members/:session` | public | List members |
| POST | `/members/:session` | admin | Add |
| PATCH| `/members/:session/:id` | admin | Update |
| DELETE| `/members/:session/:id` | admin | Delete |
| GET  | `/info` | public | info.md markdown |
| PUT  | `/info` | admin | Update info.md |
| GET  | `/audit` | developer | Audit log |
