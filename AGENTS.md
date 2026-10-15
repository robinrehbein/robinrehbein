# Repository instructions

This website uses React Router framework mode, React, Node 24 LTS and Express. The migration from Fresh/Deno is intentional and user-approved.

Preserve existing content, design, URLs, metadata and static assets. Keep server secrets out of browser bundles. Register routes explicitly in app/routes.ts; production HTTP handling belongs in server/index.ts. Do not reintroduce Fresh, Preact or a Deno runtime.

Before code changes inspect branch/upstream/worktree and update with git pull --ff-only when an upstream exists; preserve local changes. Run npm run typecheck, npm run build and npm test. Browser and Docker validation are separate from HTTP tests.
