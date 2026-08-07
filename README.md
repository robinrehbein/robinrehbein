# robinrehbein.de

Personal portfolio of Robin Rehbein — software engineer & web architect based in
Stuttgart, Germany.

Built with [Deno Fresh 2](https://fresh.deno.dev) (Preact, Vite, Tailwind CSS
4). Fully server-rendered — no islands, no client-side state, no tracking.

## Development

```sh
deno task dev     # dev server with HMR (localhost:5173)
deno task build   # production build → _fresh/
deno task start   # serve the production build
deno task check   # fmt + lint + type check
```

## Structure

- `routes/` — pages (`/`, `/work`, `/about`, `/imprint`, `/privacy`)
- `components/` — server-rendered Preact components
- `lib/site.ts` — all site content (projects, positions, contact)
- `assets/styles.css` — design system (paper/ink/racing-green, Clash Display +
  Zodiak + Anaheim)
- `static/` — fonts, photos, project imagery
