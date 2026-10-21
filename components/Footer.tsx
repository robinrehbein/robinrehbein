import { site } from "@/lib/site.ts";
import { Logo } from "@/components/Logo.tsx";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden scroll-mt-24 bg-green-deep text-paper border-t-2 border-ink">
      {/* The monogram, pressed into the footer like a blind emboss. */}
      <Logo className="emboss pointer-events-none absolute -right-20 -bottom-24 size-[26rem] md:-right-16 md:-top-[8%] md:bottom-auto md:h-[116%] md:w-auto md:aspect-square" />
      <div className="shell relative py-16 md:py-24">
        <p className="eyebrow text-mustard mb-6">Get in touch</p>
        <a
          href={`mailto:${site.email}`}
          className="display block text-[clamp(2.4rem,7.5vw,6.5rem)] font-semibold hover:text-mustard transition-colors"
        >
          Let's talk.
        </a>
        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-serif italic">
            <li>
              <a href={`mailto:${site.email}`} className="link-wavy">
                ✉ {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-wavy"
              >
                ⌥ github.com/robinrehbein
              </a>
            </li>
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 eyebrow opacity-80">
            <li>
              <a href="/imprint" className="hover:text-mustard transition-colors">
                Imprint
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-mustard transition-colors">
                Privacy
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-12 pt-6 border-t border-paper/20 flex flex-col md:flex-row justify-between gap-2 text-sm opacity-70 font-serif">
          <p>
            © {new Date().getFullYear()} {site.name} — {site.location}
          </p>
          <p className="italic">
            Handmade with React Router — server-rendered, no tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
