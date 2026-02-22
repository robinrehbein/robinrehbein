import { PageProps } from "$fresh/server.ts";
import Footer from "../components/atoms/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import CookieBanner from "../islands/CookieBanner.tsx";
import Tracking from "../islands/Tracking.tsx";

const Layout = ({ Component, state: _state }: PageProps) => {
  return (
    <>
      <Tracking />
      <header class="fixed top-0 z-10 w-full">
        <Navbar />
      </header>
      <main class="pt-32">
        <Component />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
};

export default Layout;
