# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running with Docker (recommended)

```bash
docker compose up --build        # Build image, start app + PostgreSQL, seed DB
docker compose up                # Start without rebuilding (after first build)
docker compose down              # Stop containers
docker compose down -v           # Stop and delete the database volume
docker compose logs -f app       # Tail app logs
```

App is available at `http://localhost:3000`. The database is automatically created, schema pushed, and 142 seed records inserted on first start. The seed is idempotent — it skips if records already exist.

**After any schema change** (e.g. adding a field), rebuild fully to avoid stale Prisma types:
```bash
docker compose down -v && docker compose up --build
```

## Commands (local dev without Docker)

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Build & lint
npm run build        # Production build (also acts as a type/compile check)
npm run lint         # ESLint via next lint

# Database
npm run db:push      # Push schema changes to PostgreSQL + regenerates Prisma client
npm run db:generate  # Regenerate Prisma client from schema without touching DB
npm run db:seed      # Run prisma/seed.ts via tsx (idempotent — skips if data exists)
npm run db:studio    # Open Prisma Studio GUI at http://localhost:5555
```

There are no tests configured. TypeScript correctness is checked by `npm run build` (uses `tsc --noEmit` internally via Next.js).

When the DB is unavailable locally, run `npx prisma generate` to regenerate client types from the schema so `npm run build` passes.

## Environment (local dev only)

Copy `.env.example` to `.env` and set `DATABASE_URL`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pohela_baisakh_db?schema=public"
```
Then run `npm run db:push` and optionally `npm run db:seed`. Docker sets this automatically via `docker-compose.yml`.

## Docker internals

`Dockerfile` uses a two-stage build (builder → runner). The `docker-entrypoint.sh` runs on every container start: `prisma db push` (also regenerates client) then `prisma db seed` (no-op if data exists) then `npm start`. The seed runner is `tsx` (configured in the `"prisma"` key of `package.json`).

## Architecture

This is a **Next.js 15 App Router** application — both frontend and backend live in the same repo. There are no separate server processes.

### Data flow

All pages are **client components** (`"use client"`) that fetch from the internal API using `fetch()`. There are no server components doing data fetching.

```
Browser → /api/attendees         (GET list, POST create)
Browser → /api/attendees/[id]    (PUT update, DELETE)
API routes → src/lib/prisma.ts   (singleton PrismaClient)
PrismaClient → PostgreSQL
```

### API contract

`GET /api/attendees` accepts query params: `search`, `sortBy`, `order`, `page`, `pageSize`. Returns `AttendeeListResponse` from `src/types/index.ts`.

- `search` matches against `participantsName`, `transactionNoTransfereeName`, `emailOrPhoneNo`, and `code` (case-insensitive)
- `sortBy` accepts: `attendeeNo`, `participantsName`, `emailOrPhoneNo`, `code`, `amount`, `transactionMode`, `adultParticipants`, `under15Participants`, `isPresent`, `createdAt`
- Response includes these whole-DB aggregates (ignore pagination/search): `totalPresent`, `totalUnder15Participants`, `totalAdultParticipants`, `totalPresentParticipants`, `totalOnSpotCount`, `totalOnSpotParticipants`, `totalAmount`, `totalPresentAmount`
- On-Spot Expected Amount is computed client-side as `totalOnSpotParticipants × 5` (€5 per on-spot participant)

`POST /api/attendees` accepts `{ participantsName, emailOrPhoneNo, under15Participants, adultParticipants, transactionNoTransfereeName, transactionMode, amount, isOnSpotRegistration }`. **Auto-generates** `code` (unique random 4-digit string), `attendeeNo` (max existing + 1), and `registrationDate` (formatted as `DD/MM/YY HH:MM`) server-side — never pass these from the client on create. When `isOnSpotRegistration` is `true`, `isPresent` is automatically set to `true`.

`PUT /api/attendees/[id]` accepts any subset of Attendee fields as a partial update (sparse update pattern — only provided fields are written). Used for both full edits via modal and inline `isPresent` toggling from the table row. `code` updates include a server-side uniqueness conflict check.

### Prisma schema

Single model `Attendee` with unique constraints on `attendeeNo` and `code` only (no email uniqueness):

| Field                        | Type      | Notes                                                    |
|------------------------------|-----------|----------------------------------------------------------|
| `id`                         | Int       | Auto-increment PK                                        |
| `attendeeNo`                 | Int       | Unique, sequential, server-generated                     |
| `code`                       | String    | Unique, random 4-digit, server-generated (e.g. `HB 001` for seeds) |
| `registrationDate`           | String    | Stored as formatted string `DD/MM/YY HH:MM`, auto-set on create |
| `participantsName`           | String    | Full group name (e.g. `"Rahim, Ayesha, Zara"`)           |
| `under15Participants`        | Int       | Count of participants under 15, default 0                |
| `adultParticipants`          | Int       | Count of adult participants, default 0                   |
| `transactionNoTransfereeName`| String    | Payment ref or transferee name, default `""`             |
| `emailOrPhoneNo`             | String    | Contact email or phone (not unique), default `""`        |
| `transactionMode`            | String    | Free-text payment mode, default `""`                     |
| `amount`                     | Float     | In euros (€), default 0                                 |
| `isPresent`                  | Boolean   | Default false; auto-true for on-spot registrations       |
| `isOnSpotRegistration`       | Boolean   | Default false; true when registered on the day           |
| `createdAt`                  | DateTime  | Auto-set on create                                       |
| `updatedAt`                  | DateTime  | Auto-updated on every write                              |

Schema changes go in `prisma/schema.prisma` followed by `npm run db:push` (no migration history is maintained).

### Seed file

`prisma/seed.ts` seeds 142 attendees. Each record in `seedData` includes: `registrationDate`, `participantsName`, `under15Participants`, `adultParticipants`, `transactionNoTransfereeName`, `emailOrPhoneNo`, `transactionMode`, `amount`, `code` (e.g. `"HB 001"`), `isPresent`, and `isOnSpotRegistration`. The `attendeeNo` is assigned as the array index + 1 at seed time. `isOnSpotRegistration` is forced to `false` for all seed records. The seed is idempotent — it skips entirely if any records exist.

### Styling

Custom Tailwind color palette prefixed `baisakh-` (defined in `tailwind.config.ts`):
- `baisakh-red` / `baisakh-red-dark` / `baisakh-red-light` — primary crimson
- `baisakh-green` / `baisakh-green-light` — secondary green
- `baisakh-gold` / `baisakh-gold-light` — accent amber
- `baisakh-cream` — page background

Reusable utility classes `btn-primary`, `btn-secondary`, and `input-field` are defined in `src/app/globals.css` as `@layer components`.

### Shared types

`src/types/index.ts` is the single source of truth for `Attendee`, `AttendeeListResponse`, `SortField`, `SortOrder`, and the `ON_SPOT_TRANSACTION_MODES` constant tuple (`['Cash', 'PayPal', 'Bank Transfer', 'Other']`) with its derived `OnSpotTransactionMode` type. Import from `@/types` everywhere.

### UI behaviour notes

- **Pages**: `/` (attendees list) and `/register` (on-spot registration form). Navigation tabs link between them.
- **Delete button** is hidden by default (`opacity-0`) and revealed on row hover (`group-hover:opacity-100`). The `<tr>` carries the `group` class.
- **isPresent toggle** is an inline switch in the table row — clicking it fires a `PUT /api/attendees/[id]` with only `{ isPresent }` and updates local state without a full refetch. A subsequent `fetchData()` refreshes aggregate stats.
- **On-spot rows** are visually marked with a purple left border (`border-l-2 border-purple-300`).
- **Stats boxes** — two rows. Row 1 (headcounts): Total Registrations, Total Present, Total Adult Participants, Total Under 15 Participants. Row 2 (amounts/on-spot): Total Amount Collected, Present Attendee Amount, On-Spot Registrations (count + participant sub-label), On-Spot Expected Amount (`totalOnSpotParticipants × €5`). All values come from whole-DB aggregates in the API response, not the current page.
- **Edit modal** shows `attendeeNo` in the header (read-only). Editable fields: `participantsName`, `emailOrPhoneNo`, `transactionNoTransfereeName`, `transactionMode`, `amount`, `adultParticipants`, `under15Participants`, `code`, `registrationDate`, `isPresent` toggle, `isOnSpotRegistration` toggle.
- **On-spot registration form** (`/register`) posts `isOnSpotRegistration: true`; the server auto-sets `isPresent: true` and generates `registrationDate`. Transaction mode is selected via styled button grid using `ON_SPOT_TRANSACTION_MODES`.
- **Currency** is euros (€) throughout — amount inputs, display cells, and the edit modal.
- **Registration date** is shown in the table from the stored `registrationDate` string (e.g. `02/03/26 07:06`), not derived from `createdAt`.
