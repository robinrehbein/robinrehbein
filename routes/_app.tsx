import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Robin Rehbein</title>
        <link rel="stylesheet" href="/styles.css" />
        <script
          defer
          src="https://umami.robinrehbein.de/script.js"
          data-website-id="1baf85dd-71e2-46e9-9a32-d65eddfb2d48"
        >
        </script>
      </head>
      <body class="bg-background text-foreground">
        <Component />
      </body>
    </html>
  );
}
