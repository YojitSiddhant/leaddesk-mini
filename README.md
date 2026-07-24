# LeadDesk Mini

LeadDesk Mini is a production-oriented monorepo starter for a Next.js frontend and an Express.js backend.

## Structure

- `frontend/` - Next.js App Router client
- `backend/` - Express.js API server
- `docs/` - Project documentation
- `memory-bank/` - Ongoing project memory and tracking

## Setup

Each app can be run independently for local development and future Railway deployment.

### Frontend

```bash
cd frontend
npm run dev
```

### Backend

```bash
cd backend
npm run dev
```

### Monorepo

From the repository root:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Railway readiness

- The frontend and backend live in separate folders with independent `package.json` files.
- The backend uses a production `start` script that runs compiled output from `dist/`.
- The Next.js app is configured for standalone output so it can be deployed without changing the folder layout later.

## Current status

This repository is intentionally limited to project setup only.
No application features, authentication, database tables, or API workflows have been implemented yet.

