import { SiteFooter, SiteNav } from "@/components/web/site-nav";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
