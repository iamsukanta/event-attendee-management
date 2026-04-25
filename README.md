# Pohela Baisakh Event Management

Attendee management system for Udjapon Community's Bengali New Year celebration. Built with Next.js 15, PostgreSQL, and Prisma.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS
- **Runtime**: Node.js

## Features

- Attendee registration with auto-generated codes and sequential numbering
- On-spot registration (auto-marks attendee as present)
- Inline present/absent toggling per attendee
- Search across name, contact, transaction, and code fields
- Sortable, paginated attendee table
- Aggregate stats: total registrations, present count, adult/under-15 headcounts, amounts collected, on-spot totals
- Session-based authentication with rate-limited login (5 attempts / 15 min per IP)
- Edit modal for full attendee record updates

## Getting Started

### Docker (recommended)

```bash
docker compose up --build        # Build image, start app + PostgreSQL, seed DB
docker compose up                # Start without rebuilding (after first build)
docker compose down              # Stop containers
docker compose down -v           # Stop and delete the database volume
docker compose logs -f app       # Tail app logs
```

App runs at `http://localhost:3000`. The database is automatically created, schema pushed, and 142 seed records inserted on first start. The seed is idempotent — it skips if records already exist.

**After any schema change**, rebuild fully to avoid stale Prisma types:

```bash
docker compose down -v && docker compose up --build
```

### Local Development (without Docker)

**1. Set up environment**

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pohela_baisakh_db?schema=public"
```

**2. Install dependencies**

```bash
npm install
```

**3. Push schema and seed**

```bash
npm run db:push     # Push schema to DB and regenerate Prisma client
npm run db:seed     # Seed 142 attendees (idempotent)
```

**4. Start dev server**

```bash
npm run dev         # http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (also type-checks) |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes and regenerate Prisma client |
| `npm run db:generate` | Regenerate Prisma client without touching DB |
| `npm run db:seed` | Seed the database (skips if data exists) |
| `npm run db:studio` | Open Prisma Studio at `http://localhost:5555` |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── attendees/          # GET list, POST create, PUT update, DELETE
│   │   └── auth/               # login and logout endpoints
│   ├── login/                  # Public login page
│   ├── register/               # On-spot registration page (protected)
│   └── page.tsx                # Attendee list page (protected)
├── components/
│   ├── EditModal.tsx
│   └── Pagination.tsx
├── lib/
│   ├── auth.ts                 # Credentials and session token
│   └── prisma.ts               # Singleton PrismaClient
├── middleware.ts               # Auth guard + security headers
└── types/
    └── index.ts                # Shared types and constants
prisma/
├── schema.prisma
└── seed.ts                     # 142 seed attendees
```

## Authentication

All routes are protected. Login at `/login`.

- Session cookie: `pb_session` (7-day expiry, httpOnly, sameSite: lax)
- To change credentials: update `CREDENTIALS` in `src/lib/auth.ts`
- To change the session token: update `SESSION_TOKEN` in both `src/lib/auth.ts` and `src/middleware.ts`

Security headers applied to every response: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`.

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate and set session cookie |
| `POST` | `/api/auth/logout` | Expire session cookie |
| `GET` | `/api/attendees` | List attendees (search, sort, paginate) |
| `POST` | `/api/attendees` | Create attendee (code and attendeeNo auto-generated) |
| `PUT` | `/api/attendees/[id]` | Partial update (any subset of fields) |
| `DELETE` | `/api/attendees/[id]` | Delete attendee |

`GET /api/attendees` query params: `search`, `sortBy`, `order`, `page`, `pageSize`.
