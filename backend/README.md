# LeadDesk Mini Backend

Express.js + TypeScript backend scaffold for LeadDesk Mini.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Runtime

- Health check available at `GET /api/health`
- The backend validates environment variables before startup.
- The backend tests MySQL connectivity before starting the HTTP server.
- Health responses include application and database status.
- If the database is unavailable at runtime, the health endpoint returns HTTP 503.
- CORS, Helmet, Compression, Pino HTTP logging, and Cookie Parser are enabled.
- `X-Powered-By` is disabled.

## Environment

Required environment variables:

- `PORT`
- `NODE_ENV`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_CONNECTION_LIMIT`
- `FRONTEND_URL`
- `SESSION_SECRET`
- `COOKIE_NAME`
- `SESSION_DURATION_DAYS`

Local defaults live in `backend/.env.example`. Copy that file to `backend/.env` for development.

## Local MySQL

Create the local database:

```sql
CREATE DATABASE leaddesk_mini
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Then:

1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your local MySQL credentials
3. Set `FRONTEND_URL=http://localhost:3000`
4. Set a local `SESSION_SECRET`
5. Start your MySQL server
6. Run `npm run dev`
7. Visit `GET /api/health`

The backend defaults to port `5050` to avoid conflicts with common macOS services.

## Shutdown

- `SIGINT` and `SIGTERM` trigger graceful shutdown.
- The server stops accepting new HTTP connections.
- The MySQL pool closes before exit.

## Security hardening

- Helmet is enabled with sensible defaults.
- `express-rate-limit` protects `POST /api/leads` with 20 requests per 15 minutes per IP.
- `express-rate-limit` protects `POST /api/admin/login` with 10 requests per 15 minutes per IP.
- Pino HTTP logging is enabled with pretty output in development and structured JSON in production.
- Request logs do not include cookies, passwords, or session tokens.
- Global errors return a consistent `{ success, message, error }` shape.

## Sprint scope

- Sprint 1 introduced MySQL connectivity and health verification.
- Sprint 3 added the lead submission API.
- Sprint 5 adds admin authentication tables and endpoints.
- Sprint 8 hardens the backend for production and Railway deployment.

## Database migrations

Sprint 2 adds the first schema migration at:

```text
backend/database/migrations/001_create_leads_table.sql
```

Run it against your local MySQL instance:

```bash
mysql -u root -p leaddesk_mini < backend/database/migrations/001_create_leads_table.sql
```

If you prefer an interactive session:

```bash
mysql -u root -p
USE leaddesk_mini;
SOURCE backend/database/migrations/001_create_leads_table.sql;
```

Verify the table:

```sql
SHOW CREATE TABLE leads;
SHOW INDEX FROM leads;
DESC leads;
```

Useful checks:

```sql
SELECT * FROM leads ORDER BY created_at DESC;
SELECT COUNT(*) FROM leads WHERE status = 'NEW';
```

Schema note:

- `name` is indexed to improve admin dashboard search by lead name, especially for prefix and filtered lookups.

## Admin authentication

Sprint 5 adds session-based admin authentication with HTTP-only cookies.

### Migrations

Apply the admin user and session migrations in order:

```bash
mysql -u root -p leaddesk_mini < backend/database/migrations/002_create_admin_users_table.sql
mysql -u root -p leaddesk_mini < backend/database/migrations/003_create_admin_sessions_table.sql
```

### Authentication flow

1. `POST /api/admin/login` validates the email and password with Zod.
2. The backend loads the admin user from `admin_users`.
3. The password is verified with `bcrypt`.
4. A cryptographically secure session token is generated.
5. The token is stored in `admin_sessions` and also set as an HTTP-only cookie.
6. `GET /api/admin/me` reads the cookie, validates the session, and returns the current admin profile.
7. `POST /api/admin/logout` deletes the session and clears the cookie.

### Session lifecycle

- Session tokens last 7 days.
- Expired sessions are rejected by the auth middleware.
- Sessions are stored server-side, so logout can revoke access immediately.
- No JWTs or localStorage are used.

### Cookie configuration

- `HttpOnly: true`
- `SameSite: Lax`
- `Secure: true` in production
- `Max-Age`: controlled by `SESSION_DURATION_DAYS`
- Cookie name: controlled by `COOKIE_NAME`

### Creating a local admin user

Before testing login, insert one admin user with a bcrypt hash created using 12 salt rounds.

Example shape:

```sql
INSERT INTO admin_users (name, email, password_hash)
VALUES ('Admin User', 'admin@example.com', '<bcrypt-hash>');
```

If you need a hash locally, generate one with the backend utility or a short Node script using bcrypt with 12 salt rounds.

### Verification

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- Confirm that valid credentials set the cookie.
- Confirm that wrong credentials return HTTP 401.
- Confirm that expired or missing sessions return HTTP 401.
- Confirm that logout clears the cookie and removes the session row.

## Production deployment

Railway config-as-code lives at:

- `backend/railway.json`

Suggested Railway service settings:

- Root directory: `/backend`
- Build command: `npm run build`
- Start command: `npm run start`
- Health check path: `/api/health`

Suggested production variables:

- `NODE_ENV=production`
- `PORT` provided by Railway
- `FRONTEND_URL` set to the deployed frontend URL
- `SESSION_SECRET` set to a long random secret
- `COOKIE_NAME` set to your preferred session cookie name
- `SESSION_DURATION_DAYS=7`

## Admin lead listing

Sprint 6 adds the protected lead listing endpoint for the admin dashboard.

### Endpoint

- `GET /api/admin/leads`

### Authentication

- This route requires a valid admin session cookie.
- Unauthenticated or expired sessions return HTTP 401.

### Query parameters

- `page`: optional, positive integer, default `1`
- `limit`: optional, positive integer, default `10`, maximum `50`
- `search`: optional trimmed string that searches `name` and `email`
- `status`: optional, one of `NEW`, `CONTACTED`, `CLOSED`
- `sort`: optional, one of `newest` or `oldest`, default `newest`

Unknown query parameters are rejected with HTTP 400.

### Example response

```json
{
  "success": true,
  "message": "Leads retrieved successfully.",
  "data": {
    "leads": [
      {
        "id": 1,
        "name": "Acme Corp",
        "email": "lead@acme.com",
        "budgetRange": "MEDIUM",
        "message": "We need a company website.",
        "status": "NEW",
        "createdAt": "2026-07-24T00:00:00.000Z",
        "updatedAt": "2026-07-24T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1,
      "hasPreviousPage": false,
      "hasNextPage": false
    },
    "statistics": {
      "total": 1,
      "new": 1,
      "contacted": 0,
      "closed": 0
    }
  }
}
```

### Pagination, search, filtering, and sorting

- Pagination is server-side.
- Search matches `name` or `email`.
- Status filtering accepts only the three lead statuses.
- Sorting supports newest-first and oldest-first.
- The repository layer uses parameterized MySQL queries only.

## Lead management

Sprint 7 adds protected lead status updates for authenticated admins.

### Endpoint

- `PATCH /api/admin/leads/:id/status`

### Authentication

- This route requires a valid admin session cookie.
- Unauthenticated or expired sessions return HTTP 401.

### Request body

```json
{
  "status": "CONTACTED"
}
```

### Validation rules

- `id`: required path parameter, positive integer
- `status`: required body property, one of `NEW`, `CONTACTED`, or `CLOSED`
- Unknown properties are rejected

### Response

```json
{
  "success": true,
  "message": "Lead status updated successfully.",
  "data": {
    "id": 1,
    "status": "CONTACTED"
  }
}
```

### Status flow

- Admins can move a lead between `NEW`, `CONTACTED`, and `CLOSED`
- The backend updates `status` only
- `updated_at` continues to be managed by MySQL

### Repository approach

- SQL stays inside the repository layer
- The repository verifies the lead exists before updating
- Parameterized queries are used for both lookup and update

## Public Lead Submission API

### Endpoint

- `POST /api/leads`

### Request

```json
{
  "name": "Acme Corp",
  "email": "lead@acme.com",
  "budgetRange": "MEDIUM",
  "message": "We would like to discuss a new project."
}
```

### Success response

```json
{
  "success": true,
  "message": "Lead submitted successfully.",
  "data": {
    "id": 1
  }
}
```

### Validation rules

- `name`: required, trimmed, 2 to 120 characters
- `email`: required, trimmed, valid email
- `budgetRange`: required, one of `LOW`, `MEDIUM`, `HIGH`, `ENTERPRISE`
- `message`: required, trimmed, 10 to 5000 characters
- Unknown properties are rejected

### Error responses

- Validation errors return HTTP 400.
- Database failures return HTTP 500 with a safe message.
