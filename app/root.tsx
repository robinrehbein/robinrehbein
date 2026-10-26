import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import { ScrollReveals } from "@/components/ScrollReveals.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Footer } from "@/components/Footer.tsx";
import "../assets/styles.css";
import { positions, site } from "@/lib/site.ts";
import type { ReactNode } from "react";

// Who the site is about, for search engines and AI assistants: the person, their current employers and the site itself.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  "name": site.name,
  "jobTitle": site.role,
  "description": `${site.role} based in ${site.location}, turning people's ideas into code since ${site.codingSince}.`,
  "url": site.url,
  "worksFor": positions.filter((p) => p.current).map((p) => ({ "@type": "Organization", "name": p.company, "url": p.companyUrl })),
  "knowsAbout": ["Software architecture", "Web development", "Kotlin", "Kotlin Multiplatform", "React", "React Router", "TypeScript", "AI-assisted engineering"],
  "email": `mailto:${site.email}`,
  "image": `${site.url}/me_square.webp`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Stuttgart",
    "addressCountry": "DE",
  },
  "sameAs": [site.github],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": site.name,
  "url": site.url,
  "inLanguage": "en",
  "publisher": { "@id": `${site.url}/#person` },
};

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${site.url}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${site.url}/og-image.jpg`} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="light dark" />
        {/* Applies the saved colour theme, or the system's, before first paint (see ThemeToggle). */}
        <script dangerouslySetInnerHTML={{ __html: "var t;try{t=localStorage.getItem('theme')}catch(e){}document.documentElement.dataset.theme=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'" }} />
        {/* Arms the portrait point clouds before first paint, so the photo doesn't flash before the intro. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(window.WebGLRenderingContext&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('fx-on')}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, websiteSchema]) }} />
        <Meta /><Links />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav currentPath={location.pathname} /><main id="main-content" tabIndex={-1}>{children}</main><Footer /><ScrollReveals /><ScrollRestoration /><Scripts />
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
