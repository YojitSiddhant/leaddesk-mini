# LeadDesk Mini Frontend

Production-ready Next.js App Router frontend for LeadDesk Mini.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5050`.
3. Start the backend first so the lead form can submit successfully.
4. Run the frontend with `npm run dev`.

## Environment variables

- `NEXT_PUBLIC_API_BASE_URL`: base URL for the backend API.
- Required in every environment.
- Use the local backend URL during development and the Railway backend URL in production.

## Backend integration

- The public landing page submits lead data with `fetch` to `POST /api/leads`.
- Validation mirrors the backend rules for name, email, budget range, and message.
- Loading, success, validation, and server error states are handled inline.
- The form resets after a successful submission and shows `Lead submitted successfully.`
- API requests are always built from `NEXT_PUBLIC_API_BASE_URL`; there is no hardcoded localhost fallback in the application code.

## Admin login

- The admin login screen lives at `/admin/login`.
- It uses cookie-based authentication only.
- Authenticated users are redirected away from the login form.
- No admin data is stored in localStorage.

## Admin dashboard

- The protected dashboard lives at `/admin/dashboard`.
- Dashboard requests use `credentials: "include"` so the HTTP-only session cookie is sent automatically.
- Lead rows and cards include an inline status selector and save action for updating lead status.
- Status changes call `PATCH /api/admin/leads/:id/status` and update the table plus statistics immediately.

## Lead status management

### Endpoint

- `PATCH /api/admin/leads/:id/status`

### Interaction flow

1. Open `/admin/dashboard` while authenticated.
2. Change a lead status from `NEW`, `CONTACTED`, or `CLOSED`.
3. Save the update.
4. The dashboard shows a success or error message, updates the row, and refreshes the summary counts in place.

### UI behavior

- Status controls are disabled while a save is in progress.
- No auth data is written to localStorage or sessionStorage.
- The dashboard remains responsive on mobile, tablet, and desktop widths.

## Local verification flow

1. Start the backend on port `5050`.
2. Log in at `/admin/login`.
3. Visit `/admin/dashboard` to load the protected dashboard shell.
4. Use the search, filter, sort, pagination, status update, and logout controls.
5. Confirm the dashboard redirects back to `/admin/login` after logout.

## Production deployment

Railway config-as-code lives at:

- `frontend/railway.json`

Suggested Railway service settings:

- Root directory: `/frontend`
- Build command: `npm run build`
- Start command: `npm run start -- --port $PORT --hostname 0.0.0.0`
- Health check path: `/`

Suggested production variable:

- `NEXT_PUBLIC_API_BASE_URL` set to the deployed backend URL

## Verification

- `npm run lint`
- `npm run build`
- Open the app in a browser and confirm the responsive layout on desktop, tablet, and mobile widths.
- Submit a valid lead and confirm the backend persists it.

## Structure

- `app/` contains the routed page and feature-local UI logic.
- `app/components/` contains reusable UI primitives and sections.
- `app/hooks/` contains client-side submission state.
- `app/lib/` contains API and validation helpers.
- `app/types/` contains shared frontend types.
