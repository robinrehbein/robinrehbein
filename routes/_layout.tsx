import { define } from "@/utils.ts";
import { Nav } from "@/components/Nav.tsx";
import { Footer } from "@/components/Footer.tsx";

export default define.layout(function Layout({ Component }) {
  return (
    <>
      <Nav />
      <main>
        <Component />
      </main>
      <Footer />
    </>
  );
});
