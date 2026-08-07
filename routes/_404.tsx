import { Head } from "fresh/runtime";
import { site } from "@/lib/site.ts";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{`404 — ${site.name}`}</title>
      </Head>
      <section class="shell pt-10 md:pt-16 pb-16 md:pb-24 min-h-[60vh]">
        <p class="eyebrow text-mustard-deep mb-4">Error 404</p>
        <h1 class="display font-medium text-[clamp(3rem,12vw,10rem)] mb-8">
          Nothing
          <br />
          <span class="text-green">here.</span>
        </h1>
        <p class="serif-lede max-w-md mb-8">
          The page you are looking for got lost somewhere between the plants and
          the keyboards.
        </p>
        <a href="/" class="eyebrow link-wavy">
          ← Back home
        </a>
      </section>
    </>
  );
}
