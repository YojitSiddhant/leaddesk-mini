# Architecture

## Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- Folder-first feature organization for future growth
- Public landing page uses reusable UI primitives for container, card, button, input, select, and textarea
- UI is split into small client-safe components so the hero, feature cards, and lead form remain easy to maintain
- Lead form state and submission live in a dedicated hook to keep rendering separate from side effects
- Lead form validation is mirrored on the client before submitting to the backend API
- Frontend API calls use `NEXT_PUBLIC_API_BASE_URL` so the backend URL can be swapped per environment
- Frontend API calls are centralized behind a shared API-base helper with no hardcoded localhost fallback
- The public landing page is mobile-first and uses a white-and-blue SaaS visual system with rounded cards and soft shadows
- Admin auth uses a dedicated `/admin/login` screen that talks to the backend with `credentials: include`
- No tokens are stored in localStorage; session state is cookie-driven and server-validated
- Admin dashboard uses a dedicated `/admin/dashboard` route with hook-based loading, filters, pagination, and logout
- Dashboard data is loaded through small reusable UI components so the header, statistics, filters, table, and pagination stay isolated
- Production deployment uses Railway config-as-code files in each service directory so backend and frontend can deploy independently

## Backend

- Express.js
- TypeScript
- Zod for runtime validation
- Centralized middleware and error handling
- Shared `mysql2/promise` pool for all MySQL access
- Startup database verification before HTTP listening
- `/api/health` checks database reachability with a lightweight query
- Graceful shutdown closes the HTTP server and the MySQL pool
- CORS origin is sourced from `FRONTEND_URL` in environment variables so production and local deployments stay aligned
- Request logging uses `pino-http` with development pretty printing and production JSON logs
- Rate limiting protects public lead submission and admin login endpoints
- Global error responses use a consistent `{ success, message, error }` shape and avoid stack traces in production
- Lead submission uses a controller-service-repository flow so HTTP, business logic, and SQL stay isolated
- Zod validation is centralized in `src/validators` and rejects unknown request properties
- Repository methods use parameterized queries only
- Admin authentication uses bcrypt password verification, server-side sessions, and HTTP-only cookies
- Session tokens are generated with cryptographically secure randomness and stored server-side
- Admin auth middleware validates the cookie, checks session expiry, and rejects unauthorized requests
- `/api/admin/me` returns the authenticated admin profile, while logout clears the cookie and revokes the session
- `/api/admin/leads` is protected by the same auth middleware and returns paginated, searchable, filterable dashboard data
- `/api/admin/leads/:id/status` is protected by the same auth middleware and updates a single lead status through a strict controller-service-repository flow
- The lead dashboard repository uses parameterized MySQL queries and safe wildcard escaping for search
- The dashboard updates lead status inline, then adjusts list rows and summary statistics locally so the admin never loses context

## Database Schema Rationale

- `BIGINT UNSIGNED` is used for `leads.id` to provide a large numeric keyspace for production growth without early exhaustion.
- `ENUM` is used for `budget_range` and `status` because the allowed values are fixed, finite, and part of the business contract.
- Indexes on `name`, `email`, `status`, and `created_at` support the expected admin workflows: searching by lead name, filtering by status, searching by email, and sorting recent leads.
- `email` is not unique because the same company or sender may submit multiple enquiries over time.
- `admin_users.email` is unique because admin identities must be one-to-one.
- `admin_sessions.session_token` is unique and indexed so session lookup stays fast and revocation remains simple.
- `admin_sessions.admin_user_id` is indexed to support joins and cleanup by admin user.

## Sprint 6 Notes

- The dashboard keeps auth state cookie-based and never stores session data in browser storage
- The list view supports server-side search, filtering, sorting, pagination, and statistics without exposing SQL from the UI layer

## Sprint 7 Notes

- Lead status changes use a dedicated PATCH endpoint with strict Zod validation for the path parameter and request body
- Repository logic checks lead existence before updating status so missing records produce HTTP 404 instead of silent no-ops
- The admin dashboard renders inline status selectors and save actions per lead, then updates counts immediately after a successful write

## Sprint 8 Notes

- Backend environment validation now requires production-grade configuration values such as `FRONTEND_URL`, `SESSION_SECRET`, `COOKIE_NAME`, and `SESSION_DURATION_DAYS`
- The frontend API layer now reads from a single environment-driven helper and no longer relies on hardcoded localhost fallbacks
- Railway service config files live at `backend/railway.json` and `frontend/railway.json`

## Deployment

- Frontend and backend are designed to deploy independently on Railway
- Folder structure stays stable for future service separation

## Sprint 4 Notes

- The public frontend now renders a single landing page with hero, feature highlights, and a lead capture form
- The form submits to the existing backend API and keeps validation consistent with the server contract
- Success, loading, and error states are shown inline without navigation or page reloads
