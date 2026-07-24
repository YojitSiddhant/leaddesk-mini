# Error Log
## Frontend dependency audit warning

- Date: 24 July 2026
- Status: Open — upstream dependency issue
- npm audit reports 3 high-severity vulnerabilities involving PostCSS and Sharp.
- The vulnerable packages are transitive dependencies of Next.js.
- Running `npm audit fix --force` proposes downgrading Next.js to 9.3.3, which is incompatible with the current App Router project.
- Decision: Do not force-fix. Keep Next.js updated and recheck when upstream patches are released.
- Application lint and production build must continue to pass.

## Sprint 1 backend integration

- Date: 24 July 2026
- Status: Resolved
- Issue: backend environment validation still used `MYSQL_*` keys and the health route was not mounted under `/api/health`.
- Fix: renamed the database env contract to `DB_*`, added a shared MySQL pool, added startup connection verification, moved health routing under `/api`, and implemented graceful shutdown.

## Live MySQL verification blocker

- Date: 24 July 2026
- Status: Open
- Issue: local MySQL could not be kept online in this sandbox long enough for end-to-end `/api/health` verification.
- Observation: `mysqld` produced a SIGSEGV during direct startup attempts, and the Homebrew service/socket also failed to stay connectable.
- Impact: backend build and lint passed, but live `SELECT 1` health verification could not be completed in this environment.
