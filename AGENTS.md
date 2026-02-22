# CLAUDE.md — Fresh 2.2.0 Development Rules

> This project uses **Fresh 2.2.0** — the Deno full-stack web framework built on
> Preact and Web Standards with island architecture. Documentation:
> https://fresh.deno.dev/docs/introduction

---

## Runtime & Tooling

- Runtime: **Deno** (latest stable). Never use Node.js or npm directly.
- Package registry: **JSR** (`jsr:@fresh/*`). Use `deno add` for dependencies.
- Build tool: **Vite** (optional but recommended). Config lives in
  `vite.config.ts`.
- TypeScript is first-class — no separate compilation step needed.
- Use `deno fmt` for formatting, `deno lint` for linting, `deno check` for type
  checking, `deno test` for testing.

### Key Commands

```sh
deno run -Ar jsr:@fresh/init          # Scaffold new project
deno task dev                          # Start dev server (with HMR via Vite)
deno task build                        # Build for production
deno task start                        # Start production server
deno test                              # Run tests
deno fmt                               # Format code
deno lint                              # Lint code
deno check **/*.ts **/*.tsx            # Type check
```

---

## Project Structure

```
<project root>
├── components/          # Shared Preact components (server-only by default)
│   └── Button.tsx
├── islands/             # Interactive components shipped to browser as JS
│   └── Counter.tsx
├── routes/              # File-system based routes
│   ├── api/
│   │   └── [name].tsx   # API route for /api/:name
│   ├── _app.tsx         # App wrapper — outer <html> structure
│   ├── _layout.tsx      # Layout component (inherited by child routes)
│   ├── _middleware.ts   # Middleware (applies to this dir and children)
│   └── index.tsx        # Renders /
├── static/              # Static assets (css, images, fonts)
├── client.ts            # Client entry file loaded on every page
├── main.ts              # Server entry file
├── utils.ts             # Define helpers & shared State type
├── deno.json            # Dependencies, tasks, import map, path aliases
└── vite.config.ts       # Vite configuration with Fresh plugin
```

### Rules

- **Never** create files outside this structure without explicit instruction.
- The `@/` path alias is pre-configured in `deno.json`. Always prefer `@/` for
  absolute imports from project root (e.g.,
  `import { define } from "@/utils.ts"`).
- Every file in `routes/` becomes a route. Every file in `islands/` becomes an
  island.
- Static assets go in `static/`. They are served at the root URL path.
- The `_fresh/` directory is the build output — never edit it manually, never
  commit it.

---

## The App Class

The `App` class is the heart of Fresh 2. Import from `"fresh"`.

```ts
import { App, staticFiles } from "fresh";

const app = new App<State>()
  .use(staticFiles()) // REQUIRED for file-based routing (serves island JS)
  .fsRoutes(); // Injects all file-based routes, middlewares, layouts

app.listen();
```

### Rules

- **Always** call `.use(staticFiles())` before `.fsRoutes()`. Without it, island
  JavaScript won't be served.
- Middlewares and routes are applied **top to bottom**. A middleware defined
  after a `.get()` handler won't apply to it.
- Use `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`, `.head()`,
  `.all()` for programmatic routes.
- Use `.use()` for middlewares.
- Use `.appWrapper()` to set the app wrapper component.
- Use `.layout()` to set layout components at a path.
- Use `.onError()` for error handling, `.notFound()` for 404s.
- Use `.mountApp()` to mount sub-apps at a path.
- Use `.handler()` to create a request handler function (useful for testing).
- Use `.listen()` to start the server.
- The `App` class accepts a generic type parameter for state:
  `new App<{ user: User }>()`.

---

## Routing

### File-Based Routing

File names in `routes/` map to URL patterns:

| File                       | Route Pattern              |
| -------------------------- | -------------------------- |
| `routes/index.tsx`         | `/`                        |
| `routes/about.tsx`         | `/about`                   |
| `routes/blog/[slug].tsx`   | `/blog/:slug`              |
| `routes/api/[...path].tsx` | `/api/*` (wildcard)        |
| `routes/blog/index.tsx`    | `/blog` (same as blog.tsx) |

### Rules

- File extensions are ignored when matching routes.
- Wrap path segments in `[` and `]` for dynamic parameters (e.g., `[id].tsx`).
- Use `[...name]` for wildcard/catch-all segments (must be last segment).
- `index.tsx` and `../name.tsx` are equivalent — don't create both.
- **Route groups**: Folders wrapped in parentheses like `(marketing)` group
  routes without affecting the URL path. Use them for shared layouts.
- **Private folders**: Folders starting with `(_` like `(_components)` are
  ignored by the router. Use for co-located components.
- **Co-located islands**: `(_islands)` folders inside routes are treated as
  islands by Fresh.
- Special files:
  - `_app.tsx` — App wrapper (outer HTML shell)
  - `_layout.tsx` — Layout (inherited by child routes)
  - `_middleware.ts` — Middleware (applies to directory and children)

### Route Config

Export a `config` object from route files for advanced options:

```ts
import type { RouteConfig } from "fresh";

export const config: RouteConfig = {
  skipAppWrapper: true, // Don't render _app.tsx
  skipInheritedLayouts: true, // Don't render parent layouts
  routeOverride: "/custom", // Override the file-based pattern
};
```

> **Warning**: Routes with `routeOverride` are never lazily loaded.

---

## Context Object

The `Context` (ctx) is passed through every middleware and handler. Key
properties and methods:

```ts
ctx.req          // Incoming Request object
ctx.url          // URL instance of the request
ctx.params       // Route parameters (e.g., { slug: "hello" })
ctx.state        // Shared state object (typed via App generic)
ctx.route        // Matched route pattern string (or null)
ctx.config       // Resolved Fresh configuration
ctx.next()       // Call next middleware in chain, returns Response
ctx.render(jsx)  // Render JSX to HTML Response
ctx.redirect(url, status?)  // Create redirect Response
ctx.error        // Error object (in error handlers)
```

### Rules

- `ctx.render()` accepts JSX and optional `{ status, headers }` as second arg.
- **Always** call `ctx.next()` in middlewares unless you want to short-circuit.
- Handlers and middlewares share the same function signature:
  `(ctx: Context) => Response | Promise<Response>`.
- In Fresh 2, the `Request` is accessed via `ctx.req` — it is NOT a separate
  first parameter (this changed from Fresh 1.x).

---

## Middlewares

```ts
// Programmatic
const app = new App<{ greeting: string }>()
  .use((ctx) => {
    ctx.state.greeting = "Hello";
    return ctx.next();
  })
  .get("/", (ctx) => ctx.render(<h1>{ctx.state.greeting}</h1>));

// File-based: routes/_middleware.ts
import { define } from "@/utils.ts";

export default define.middleware(async (ctx) => {
  console.log("middleware hit");
  return await ctx.next();
});
```

### Rules

- Middlewares run in order of definition (top to bottom for programmatic, file
  hierarchy for file-based).
- You can export an array of middlewares from `_middleware.ts`.
- Use `define.middleware()` for typed file-based middlewares.
- Built-in middlewares: `staticFiles()`, `cors()`, `csrf()`, `csp()`,
  `trailingSlashes()`.
- Middlewares can modify the response AFTER `ctx.next()`:
  ```ts
  const res = await ctx.next();
  res.headers.set("X-Custom", "value");
  return res;
  ```

---

## Islands (Interactive Components)

Islands are the **only** components that ship JavaScript to the browser.
Everything else is server-rendered HTML with zero JS.

### Rules

- Place islands in `islands/` at project root OR in `(_islands)/` folders within
  routes.
- Island filenames **must** be PascalCase or kebab-case.
- Islands **must** have a `default export` of a Preact component.
- Island props **must be serializable**. Supported types:
  - Primitives: `string`, `number`, `boolean`, `bigint`, `undefined`, `null`
  - `Uint8Array`
  - Arrays and plain objects of the above
  - JSX (as `children` or named props)
  - Preact `Signal` instances
- **Never** pass non-serializable values (functions, classes, Dates, Maps, Sets,
  etc.) as island props.
- Islands can receive `children` as server-rendered JSX — this JSX renders on
  the server and is passed through.
- Islands can be nested within other islands.
- Use `@preact/signals` for reactive state in islands.
- Use `preact/hooks` (`useState`, `useEffect`, etc.) for component logic.
- For client-only APIs (e.g., `navigator`, `EventSource`), check
  `typeof window !== "undefined"` or use `useEffect`.

```tsx
// islands/Counter.tsx
import { useSignal } from "@preact/signals";

export default function Counter(props: { start: number }) {
  const count = useSignal(props.start);
  return (
    <div>
      <button onClick={() => (count.value -= 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => (count.value += 1)}>+</button>
    </div>
  );
}
```

---

## App Wrapper (`_app.tsx`)

The app wrapper renders the outer HTML document shell. It only runs on the
server.

```tsx
// routes/_app.tsx
import { define } from "@/utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
```

### Rules

- The `Component` prop represents the child content (layout → page).
- Every `ctx.render()` includes the app wrapper unless `skipAppWrapper: true` is
  set in route config.
- Only renders on the server — never hydrated on the client.

---

## Layouts

Layouts wrap route content and are inherited by child routes.

```tsx
// routes/_layout.tsx
import { define } from "@/utils.ts";

export default define.layout(({ Component, state }) => (
  <div>
    <nav>My Nav</nav>
    <Component />
  </div>
));
```

### Rules

- Layouts only render on the server.
- Layouts are inherited from parent directories unless
  `skipInheritedLayouts: true`.
- Use route groups `(groupname)` with `_layout.tsx` inside to apply different
  layouts to different route sets.
- Use `define.layout()` helper for typing.

---

## Define Helpers

Set up once in `utils.ts`, import everywhere:

```ts
// utils.ts
import { createDefine } from "fresh";

export interface State {
  // your shared state type
  user?: { name: string };
}

export const define = createDefine<State>();
export type { State };
```

### Available Helpers

- `define.middleware(fn)` — Typed middleware
- `define.handlers({ GET, POST, ... })` — Typed route handlers
- `define.page<typeof handler>(fn)` — Typed page component (linked to handler
  data)
- `define.layout(fn)` — Typed layout component

### Handler + Page Pattern

```tsx
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    return { data: { name: "World" } };
  },
});

export default define.page<typeof handler>((props) => (
  <h1>Hello {props.data.name}</h1>
));
```

### Rules

- Handlers return `{ data: T }` to pass data to the page component.
- The page receives `props.data` with full type inference when using
  `define.page<typeof handler>`.
- `define.*` helpers are optional — you can use explicit types instead.

---

## Forms

Fresh handles forms server-side using standard Web APIs.

```tsx
import { define } from "@/utils.ts";

export const handlers = define.handlers({
  async GET(ctx) {
    return { data: {} };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    // Process email...
    return new Response(null, {
      status: 303,
      headers: { location: "/thanks" },
    });
  },
});

export default define.page<typeof handlers>(function Subscribe() {
  return (
    <form method="post">
      <input type="email" name="email" />
      <button type="submit">Subscribe</button>
    </form>
  );
});
```

### Rules

- Use standard HTML `<form method="post">` for form submissions.
- Access form data via `ctx.req.formData()`.
- Redirect after POST with 303 status (Post/Redirect/Get pattern).
- For file uploads, use `encType="multipart/form-data"`.
- **Always validate data server-side** and protect against CSRF in production.

---

## Partials (SPA-like Navigation)

Partials enable client-side navigation without full page reloads.

```tsx
import { Partial } from "fresh/runtime";

// In _app.tsx — enable client nav and wrap content
<body f-client-nav>
  <Partial name="body">
    <Component />
  </Partial>
</body>;
```

### Rules

- Import `Partial` from `"fresh/runtime"`.
- Add `f-client-nav` attribute to a parent element to enable partial navigation
  for all descendant links.
- Wrap updatable regions with `<Partial name="unique-name">`.
- Partial `name` props **must be unique** across the page.
- Use `f-partial="/path"` on `<a>` tags to fetch content from an optimized
  partial route instead of the full page.
- Opt out with `f-client-nav={false}` on specific elements.
- Optimized partial routes should set `skipAppWrapper: true` and
  `skipInheritedLayouts: true` in route config.

---

## Error Handling

```ts
// Programmatic
app.onError("*", (ctx) => {
  return new Response(String(ctx.error), { status: 500 });
});

app.notFound(() => {
  return new Response("Not found", { status: 404 });
});

// File-based: routes/_error.tsx for errors, routes/_404.tsx for not found
```

---

## Environment Variables

### Rules

- Use `FRESH_PUBLIC_` prefix for variables that should be inlined into
  client-side code.
- Access via `Deno.env.get("FRESH_PUBLIC_FOO")` or
  `process.env.FRESH_PUBLIC_FOO`.
- The variable name **must be a static string literal** — dynamic access won't
  work:
  ```ts
  // ✅ CORRECT
  Deno.env.get("FRESH_PUBLIC_FOO");
  process.env.FRESH_PUBLIC_FOO;

  // ❌ WRONG — not statically analyzable
  const name = "FRESH_PUBLIC_FOO";
  Deno.env.get(name);
  Deno.env.toObject().FRESH_PUBLIC_FOO;
  ```
- Server-only env vars don't need the prefix and can be accessed normally.

---

## Static Files

- Place files in `static/` directory.
- Served at root path (e.g., `static/logo.png` → `/logo.png`).
- The `staticFiles()` middleware must be registered for this to work.
- Use for CSS, images, fonts, `robots.txt`, `favicon.ico`, etc.

---

## Modifying `<head>`

Use the `<Head>` component from `"fresh/runtime"` to inject elements into
`<head>` from any component:

```tsx
import { Head } from "fresh/runtime";

export default function MyPage() {
  return (
    <>
      <Head>
        <title>My Page Title</title>
        <meta name="description" content="..." />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <h1>Content</h1>
    </>
  );
}
```

---

## Built-in Plugins / Middlewares

### cors

```ts
import { cors } from "fresh";
app.use(cors({ origin: "http://example.com", credentials: true }));
```

### csrf

```ts
import { csrf } from "fresh";
app.use(csrf());
```

### csp (Content Security Policy)

```ts
import { csp } from "fresh";
app.use(csp({
  reportOnly: true,
  reportTo: "/api/csp-reports",
  csp: ["script-src 'self'"],
}));
```

### trailingSlashes

```ts
import { trailingSlashes } from "fresh";
app.use(trailingSlashes("always")); // or "never"
```

---

## Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
});
```

### Rules

- The Fresh Vite plugin handles Preact aliasing automatically — don't manually
  alias `react` → `preact/compat`.
- Vite provides HMR in dev mode.
- The dev server runs on `localhost:5173` by default with Vite.
- Production build outputs to `_fresh/` directory.

---

## Testing

Use Deno's built-in test runner. Create `App` instances for unit testing.

```ts
import { expect } from "@std/expect";
import { App } from "fresh";
import { type State } from "../utils.ts";

Deno.test("GET / returns hello", async () => {
  const app = new App<State>()
    .get("/", (ctx) => ctx.render(<h1>hello</h1>))
    .handler();

  const res = await app(new Request("http://localhost/"));
  const text = await res.text();
  expect(text).toContain("hello");
});
```

### Rules

- Use `app.handler()` to get a request handler function for testing.
- Test middlewares by adding them to a test app and asserting on state or
  response headers.
- Test route handlers by importing and mounting them on a test app.
- For full integration tests with islands, use `buildFreshApp()` +
  `startTestServer()` pattern with Vite builder.
- Test files should use `.test.ts` or `_test.ts` suffix (auto-ignored by Fresh
  router).
- Use `.tsx` extension for test files that contain JSX.

---

## Migration from Fresh 1.x

Key differences from Fresh 1.x to 2.x:

| Fresh 1.x                                             | Fresh 2.x                                             |
| ----------------------------------------------------- | ----------------------------------------------------- |
| `import { ... } from "$fresh/server.ts"`              | `import { ... } from "fresh"`                         |
| `const foo = (req: Request, ctx) => ...`              | `const foo = (ctx) => ...` (no separate req param)    |
| `$fresh/runtime.ts`                                   | `"fresh/runtime"`                                     |
| `export const handler: Handlers = { ... }`            | `export const handler = define.handlers({ ... })`     |
| Start via `start(manifest, config)`                   | Start via `new App().listen()`                        |
| `Handlers`, `PageProps`, etc. from `$fresh/server.ts` | Use `define.*` helpers or import types from `"fresh"` |

### Rules

- **Never** use `$fresh/server.ts` or `$fresh/runtime.ts` imports — these are
  Fresh 1.x.
- **Never** use `(req: Request, ctx)` handler signature — Fresh 2 uses `(ctx)`
  only.
- **Never** use `export const handler: Handlers = { ... }` — use
  `define.handlers()`.
- **Never** use `start(manifest, config)` — use `new App().listen()`.
- **Never** use `IS_BROWSER` from `$fresh/runtime.ts` — use standard browser
  detection.

---

## Deployment

### Deno Deploy (Recommended)

Push to GitHub → connect to Deno Deploy → automatic deployment.

### Docker

```dockerfile
FROM denoland/deno:latest
WORKDIR /app
COPY . .
RUN deno task build
CMD ["deno", "task", "start"]
```

### deno compile

```sh
deno task build
deno compile --allow-net --allow-read --allow-env -o app main.ts
```

---

## Code Style & Conventions

- Use TypeScript for all files.
- Use `.tsx` extension for files containing JSX.
- Use `.ts` extension for files without JSX.
- Prefer `define.*` helpers for typed routes, middlewares, layouts, and pages.
- Prefer Preact Signals (`@preact/signals`) over `useState` for island state.
- Keep islands minimal — only what needs interactivity.
- Server components (in `components/`) should never use hooks or browser APIs.
- Prefer server-side data fetching in handlers over client-side fetching.
- Use the Post/Redirect/Get pattern for form submissions.
- Import from `"fresh"` for server APIs and `"fresh/runtime"` for client APIs
  (`Partial`, `Head`).

---

## Common Mistakes to Avoid

1. **Forgetting `staticFiles()` middleware** — islands won't load without it.
2. **Passing non-serializable props to islands** — functions, Dates, Maps will
   fail.
3. **Using Fresh 1.x imports** (`$fresh/server.ts`) — always use `"fresh"`.
4. **Using `(req, ctx)` handler signature** — Fresh 2 only passes `(ctx)`.
   Access request via `ctx.req`.
5. **Putting interactive code in `components/`** — only `islands/` and
   `(_islands)/` ship JS.
6. **Dynamic env var access** — `FRESH_PUBLIC_*` vars must be accessed with
   string literals.
7. **Editing `_fresh/` directory** — it's auto-generated build output.
8. **Defining middleware after a handler** — middlewares only apply to handlers
   defined after them.
9. **Non-unique Partial names** — each `<Partial name="...">` must have a unique
   name.
10. **Missing `f-client-nav`** — Partials won't work without this attribute on
    an ancestor element.
