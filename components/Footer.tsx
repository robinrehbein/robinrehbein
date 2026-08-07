import { site } from "@/lib/site.ts";

export function Footer() {
  return (
    <footer class="bg-green-deep text-paper border-t-2 border-ink">
      <div class="shell py-16 md:py-24">
        <p class="eyebrow text-mustard mb-6">Get in touch</p>
        <a
          href={`mailto:${site.email}`}
          class="display block text-[clamp(2.4rem,7.5vw,6.5rem)] font-semibold hover:text-mustard transition-colors"
        >
          Let's talk.
        </a>
        <div class="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <ul class="flex flex-wrap gap-x-8 gap-y-3 font-serif italic">
            <li>
              <a href={`mailto:${site.email}`} class="link-wavy">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                class="link-wavy"
              >
                github.com/robinrehbein
              </a>
            </li>
          </ul>
          <ul class="flex flex-wrap gap-x-6 gap-y-2 eyebrow opacity-80">
            <li>
              <a href="/imprint" class="hover:text-mustard transition-colors">
                Imprint
              </a>
            </li>
            <li>
              <a href="/privacy" class="hover:text-mustard transition-colors">
                Privacy
              </a>
            </li>
          </ul>
        </div>
        <div class="mt-12 pt-6 border-t border-paper/20 flex flex-col md:flex-row justify-between gap-2 text-sm opacity-70 font-serif">
          <p>
            © {new Date().getFullYear()} {site.name} — {site.location}
          </p>
          <p class="italic">
            Handmade with Deno Fresh — server-rendered, no islands, no tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
