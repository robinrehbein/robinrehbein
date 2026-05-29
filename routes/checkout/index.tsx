import { Head } from "fresh/runtime";
import { define } from "@/utils.ts";
import CheckoutForm from "@/islands/CheckoutForm.tsx";

export const handler = define.handlers({
  GET() {
    return {
      data: { publishableKey: Deno.env.get("STRIPE_PUBLISHABLE_KEY") ?? "" },
    };
  },
});

export default define.page<typeof handler>(({ data }) => (
  <>
    <Head>
      <title>Kasse - Robin Rehbein Shop</title>
      <meta name="robots" content="noindex" />
    </Head>
    <section class="shell max-w-3xl py-12">
      <a
        href="/"
        class="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        ← Weiter shoppen
      </a>
      <h1 class="display mb-8 mt-4 text-3xl font-semibold md:text-4xl">
        Kasse
      </h1>
      <CheckoutForm publishableKey={data.publishableKey} />
    </section>
  </>
));
