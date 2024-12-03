import { PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";

const Layout = ({ Component, state }: PageProps) => {
  return (
    <>
      <header class="fixed top-6 z-10 w-full p-4">
        <Navbar />
      </header>
      <main class={"pt-32"}>
        <Component />
      </main>
    </>
  );
};

export default Layout;
