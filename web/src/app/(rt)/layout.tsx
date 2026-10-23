import { Nav } from "@/components/nav";

export const metadata = { robots: { index: false, follow: false } };

export default function RtLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="flex-1 text-base">{children}</div>
    </>
  );
}
