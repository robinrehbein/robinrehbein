# robinrehbein.de

Personal portfolio of Robin Rehbein — software engineer & web architect based in Stuttgart, Germany.

React Router framework mode with React, Express, Vite and Tailwind CSS 4. Pages are server-rendered; no tracking.

## Development

Use Node 24 LTS (24.18.0 in the production image).

```sh
npm ci --include=dev
npm run dev        # Vite development server
npm run typecheck
npm run build      # production output in build/
npm test           # starts and stops the production server for HTTP checks
npm start          # production Express server on port 8000
```

Tests require a production build. TEST_BASE_URL can target an already running server instead.

## Deployment

Coolify builds the multistage Dockerfile from the reviewed commit. The production image runs as the unprivileged node user, listens on 0.0.0.0:8000 and includes an HTTP healthcheck. No database or secrets are required. ADMIN_PASSWORD and DENO_KV_PATH are obsolete and must not be configured.

## Structure

- app/root.tsx — document, shared navigation and footer
- app/routes.ts and app/routes/ — explicit page routes and 404
- server/index.ts — Express production server and security headers
- components/ — React components
- lib/site.ts — portfolio content
- assets/styles.css — existing design system
- static/ — fonts, photos and project imagery, preserved at their existing URLs
