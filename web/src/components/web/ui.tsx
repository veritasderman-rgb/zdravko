import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ id, eyebrow, title, lead, children, className = "" }: { id?: string; eyebrow?: string; title: string; lead?: string; children?: ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-[1100px] px-4 py-12 ${className}`}>
      {eyebrow && <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</div>}
      <h2 className="mt-1 max-w-3xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{title}</h2>
      {lead && <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted md:text-lg">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-[1100px] px-4 py-14 md:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{eyebrow}</div>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{lead}</p>
      </div>
    </div>
  );
}

export function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <div className="text-3xl font-semibold leading-none tracking-tight md:text-4xl">{value}</div>
      <div className="mt-2 text-sm text-foreground">{label}</div>
      {note && <div className="mt-1 text-xs text-muted">{note}</div>}
    </div>
  );
}

export function Card({ title, children, tone = "paper" }: { title?: ReactNode; children: ReactNode; tone?: "paper" | "accent" | "warm" }) {
  const cls = tone === "accent" ? "border-accent/30 bg-accent-soft/50" : tone === "warm" ? "border-amber-200 bg-amber-50/60" : "border-line bg-paper";
  return (
    <div className={`rounded-xl border p-5 ${cls}`}>
      {title && <div className="font-semibold">{title}</div>}
      <div className={`${title ? "mt-2" : ""} text-sm leading-relaxed text-foreground`}>{children}</div>
    </div>
  );
}

export function NextLink({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="group block rounded-xl border border-line bg-paper p-5 transition hover:border-accent">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Pokračovat</div>
      <div className="mt-1 text-lg font-semibold group-hover:underline">{title}</div>
      <div className="mt-1 text-sm text-muted">{text}</div>
    </Link>
  );
}
