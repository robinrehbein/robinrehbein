export function loader() { return new Response(null, {status:404}); }
export function meta() { return [{ title: `404 — ${site.name}` }, { name: "robots", content: "noindex" }]; }
import { site } from "@/lib/site.ts";

export default function NotFound() {
  return (
    <>
      <section className="shell pt-10 md:pt-16 pb-16 md:pb-24 min-h-[60vh]">
        <p className="eyebrow text-mustard-deep mb-4">Error 404</p>
        <h1 className="display font-medium text-[clamp(3rem,12vw,10rem)] mb-8">
          Nothing
          <br />
          <span className="text-green">here.</span>
        </h1>
        <p className="serif-lede max-w-md mb-8">
          The page you are looking for got lost somewhere between the plants and
          the keyboards.
        </p>
        <a href="/" className="eyebrow link-wavy">
          ← Back home
        </a>
      </section>
    </>
  );
}
