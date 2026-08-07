import { define } from "@/utils.ts";
import { site } from "@/lib/site.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${site.name} — ${site.role}`}</title>
        <meta
          name="description"
          content={`${site.name}, ${site.role} based in ${site.location}. Turning people's ideas into code since ${site.codingSince}.`}
        />
        <meta property="og:title" content={`${site.name} — Portfolio`} />
        <meta
          property="og:description"
          content={`Turning people's ideas into code since ${site.codingSince}.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={site.url} />
        <meta property="og:image" content={`${site.url}/me_square.jpg`} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
