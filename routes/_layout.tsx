import { type PageProps } from "fresh";
import SiteFooter from "@/components/SiteFooter.tsx";
import SiteNav from "@/components/SiteNav.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <SiteNav />
      <main>
        <Component />
      </main>
      <SiteFooter />
    </>
  );
}
