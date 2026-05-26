# FlowSpace

A production-grade project management SPA built with React 19, Hono, Drizzle ORM, and Better Auth.

## Stack

| Layer    | Tech                                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite, TanStack Router, TanStack Query v5, React Hook Form, Zod, Tailwind CSS, shadcn/ui, Zustand |
| Backend  | Hono, Better Auth, Drizzle ORM                                                                             |
| Database | PostgreSQL                                                                                                 |
| Monorepo | Turborepo, pnpm workspaces                                                                                 |

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- PostgreSQL running locally (or a connection string to a hosted instance)

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example env files and fill in your values:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Minimum required in `apps/api/.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/flowspace
BETTER_AUTH_SECRET=your-random-32-char-secret
BETTER_AUTH_URL=http://localhost:5173
```

### 3. Run database migrations

```bash
# Generate migration files from schema
pnpm --filter @flowspace/db db:generate

# Apply migrations to your database
pnpm --filter @flowspace/db db:migrate
```

### 4. Start development servers

```bash
pnpm dev
```

This starts both `apps/api` (port 3000) and `apps/web` (port 5173) via Turborepo.

---

## Project Structure

```
flowspace/
├── apps/
│   ├── api/          # Hono backend
│   └── web/          # React frontend
├── packages/
│   ├── db/           # Drizzle schema + db connection
│   ├── types/        # Shared TypeScript types
│   └── validators/   # Shared Zod schemas
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Key Conventions

- **API routes** follow REST: `/api/workspaces/:workspaceId/projects/:projectId/tasks`
- **Auth** is handled entirely by Better Auth — session cookie is sent with every request via `credentials: "include"`
- **Query keys** are centralised in `apps/web/src/lib/query-keys.ts`
- **Route guards** live in `beforeLoad` on the `_authenticated` layout route
- **Zustand** is only used for ephemeral UI state (sidebar, modals, theme) — server state lives in TanStack Query

---

## Development Commands

```bash
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm typecheck        # Type-check all apps
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
```

---

## Architecture Flow

```
Browser
  └─ TanStack Router (file-based routing)
       └─ __root.tsx (QueryProvider + AuthProvider)
            └─ _authenticated.tsx (route guard → Dashboard layout)
                 └─ workspace/$workspaceId/...
                      └─ hooks (useQuery / useMutation)
                           └─ apiClient (fetch wrapper)
                                └─ Hono API (port 3000)
                                     ├─ auth middleware (Better Auth session)
                                     ├─ workspace middleware (membership check)
                                     └─ Drizzle ORM → PostgreSQL
```
