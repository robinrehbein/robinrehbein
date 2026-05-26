import { type PageProps } from "fresh";
import { Head } from "fresh/runtime";
import "@/assets/styles.css";

export default function App({ Component }: PageProps) {
  return (
    <html lang="de">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Robin Rehbein entwickelt digitale Produkte, schreibt über Webtechnologie und bietet 3D gedruckte Objekte sowie individuelle Druckaufträge an."
        />
        <title>Robin Rehbein - Code, Blog & 3D Print Studio</title>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
