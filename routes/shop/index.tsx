import { define } from "@/utils.ts";

// The storefront now lives at "/". Keep "/shop" as a permanent redirect so old
// links and the nav stay valid.
export const handler = define.handlers({
  GET(ctx) {
    return ctx.redirect("/", 308);
  },
});
