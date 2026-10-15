import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import { Nav } from "@/components/Nav.tsx";
import { Footer } from "@/components/Footer.tsx";
import "../assets/styles.css";
import { site } from "@/lib/site.ts";
import type { ReactNode } from "react";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": site.name,
  "jobTitle": site.role,
  "url": site.url,
  "email": `mailto:${site.email}`,
  "image": `${site.url}/me_square.webp`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Stuttgart",
    "addressCountry": "DE",
  },
  "sameAs": [site.github],
};

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${site.name} — Portfolio`} />
        <meta
          property="og:description"
          content={`Turning people's ideas into code since ${site.codingSince}.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={site.url} />
        <meta property="og:image" content={`${site.url}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${site.url}/og-image.jpg`} />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <Meta /><Links />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav currentPath={location.pathname} /><main id="main-content" tabIndex={-1}>{children}</main><Footer /><ScrollRestoration /><Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <section className="shell py-16 min-h-[60vh]">
      <h1 className="display text-4xl mb-8">Something went wrong.</h1>
      <p className="serif-lede mb-8">Please try again or return to the home page.</p>
      <a href="/" className="eyebrow link-wavy">← Back home</a>
    </section>
  );
}
