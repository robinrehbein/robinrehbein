export default function SiteFooter() {
  return (
    <footer class="border-t border-[var(--line)] py-10">
      <div class="shell grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p class="display text-3xl font-semibold">Robin Rehbein</p>
          <p class="mt-3 max-w-md text-sm opacity-75">
            Senior Software Engineer aus Stuttgart. Ich entwickle digitale
            Produkte, schreibe ueber Webtechnologie und baue kleine Objekte aus
            dem 3D-Drucker.
          </p>
        </div>
        <div>
          <p class="eyebrow">Kontakt</p>
          <a
            class="mt-3 block font-semibold"
            href="mailto:hello@robinrehbein.de"
          >
            hello@robinrehbein.de
          </a>
          <a
            class="mt-2 block opacity-75"
            href="https://github.com/robinrehbein"
          >
            github.com/robinrehbein
          </a>
        </div>
        <div>
          <p class="eyebrow">Rechtliches</p>
          <a class="mt-3 block opacity-75" href="/imprint">Impressum</a>
          <a class="mt-2 block opacity-75" href="/privacy">Datenschutz</a>
          <a class="mt-2 block opacity-75" href="/disclaimer">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
