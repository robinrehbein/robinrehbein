import { PageProps } from "$fresh/server.ts";
import Footer from "../components/atoms/Footer.tsx";
import Navbar from "../components/Navbar.tsx";

const Layout = ({ Component, state }: PageProps) => {
  return (
    <>
      <header class="fixed top-0 z-10 w-full">
        <Navbar />
      </header>
      <main class={"pt-32"}>
        <Component />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
