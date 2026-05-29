import { type PageProps } from "fresh";
import SiteFooter from "@/components/SiteFooter.tsx";
import SiteNav from "@/components/SiteNav.tsx";
import CartDrawer from "@/islands/CartDrawer.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <SiteNav />
      <main>
        <Component />
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
