# Commerce Operations / Fieldwork

## Run

Requires Node.js 22.13+ (tested on 22.19). No npm dependencies.
Double-click START.cmd, keep terminal open, then open http://localhost:4181
Or run `npm start` from this project folder. Stop with Ctrl+C.
Run `npm test` for isolated backend integration tests. Tests do not touch the demo database.

## Folder map

- frontend/pages/: each screen has its own index.html, page.js, page.css
- frontend/features/: feature-specific cards/state/map code
- frontend/shared/api/: HTTP client
- frontend/shared/layout/: shared navigation and demo-account selector
- frontend/shared/styles/: base styles and project-specific tokens
- frontend/shared/ui/: formatting, escaping and interaction helpers
- frontend/assets/: local SVG illustrations (no remote assets)
- backend/server.mjs: registration and startup only
- backend/core/: server, router, SQLite connection and common validation primitives
- backend/features/: API routes, business services and data access by feature
- database/schema/: tables and constraints
- database/seed.mjs: initial demo records; runs only on an empty database
- database/data/app.sqlite: persistent local data, generated on first start
- tests/: integration scenarios
- docs/: editing guide, API list and architecture

## Demo limitations

Local demonstration, not production deployment. Account switching is intentionally public and replaces login; never expose this server to a public network. Sessions expire after 24 hours and are held in server memory. Database persists across restarts. Money is stored as integer cents. Server binds to 127.0.0.1 only.
Payments and shipping are simulated. Product prices are server-authoritative. Checkout and stock restoration run in transactions. Customer, staff and admin permissions are checked on the server.
