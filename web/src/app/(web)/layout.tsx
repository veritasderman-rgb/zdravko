import { SiteFooter, SiteNav } from "@/components/web/site-nav";
import { DownloadTracker } from "@/components/web/download-tracker";
import "./print.css";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main id="obsah" className="flex-1">{children}</main>
      <SiteFooter />
      <DownloadTracker />
    </>
  );
}
