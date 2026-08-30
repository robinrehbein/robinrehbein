import { define } from "@/utils.ts";
import { Nav } from "@/components/Nav.tsx";
import { Footer } from "@/components/Footer.tsx";

export default define.layout(function Layout({ Component, url }) {
  return (
    <>
      <Nav currentPath={url.pathname} />
      <main id="main-content" tabIndex={-1}>
        <Component />
      </main>
      <Footer />
    </>
  );
});
