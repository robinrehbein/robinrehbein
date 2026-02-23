import { type PageProps } from "fresh";
const UMAMI_SCRIPT_SRC = "https://umami.robinrehbein.de/script.js";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Robin Rehbein Portfolio - home.</title>
        <link rel="stylesheet" href="/styles.css" />
        <script
          defer
          src={UMAMI_SCRIPT_SRC}
          crossOrigin="anonymous"
        >
        </script>
      </head>
      <body class="bg-background text-foreground">
        <Component />
      </body>
    </html>
  );
}
