"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { Button, TextLink } from "./ui";

/**
 * Klientská část hlavičky: aktivní položka (aria-current), menu „Více“ (Escape, šipky, klik mimo)
 * a celoobrazovkové mobilní menu pod 900 px (focus trap, Escape, zamčené posouvání stránky).
 */

type NavLink = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DESKTOP_LINK =
  "inline-flex min-h-11 items-center rounded-full px-2.5 text-lg font-semibold text-ink no-underline decoration-2 underline-offset-[7px] hover:underline xl:px-3.5 whitespace-nowrap";

export function SiteNavClient({ links, more, brand }: { links: NavLink[]; more: NavLink[]; brand: ReactNode }) {
  const pathname = usePathname() ?? "/";
  return (
    <>
      <nav aria-label="Hlavní navigace" className="hidden items-center min-[900px]:flex">
        <ul className="flex items-center gap-0.5">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link href={l.href} aria-current={active ? "page" : undefined} className={`${DESKTOP_LINK} ${active ? "underline" : ""}`}>
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <MoreMenu items={more} pathname={pathname} />
          </li>
        </ul>
      </nav>
      <MobileMenu links={links} more={more} brand={brand} pathname={pathname} />
    </>
  );
}

function MoreMenu({ items, pathname }: { items: NavLink[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const activeInside = items.some((l) => isActive(pathname, l.href));

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function focusItem(delta: number | "first" | "last") {
    const links = Array.from(wrap.current?.querySelectorAll<HTMLAnchorElement>("[data-more-item]") ?? []);
    if (!links.length) return;
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = delta === "first" ? 0 : delta === "last" ? links.length - 1 : (current + delta + links.length) % links.length;
    links[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => focusItem(e.key === "ArrowDown" ? "first" : "last"));
      } else {
        focusItem(e.key === "ArrowDown" ? 1 : -1);
      }
    } else if (open && (e.key === "Home" || e.key === "End")) {
      e.preventDefault();
      focusItem(e.key === "Home" ? "first" : "last");
    }
  }

  return (
    <div
      ref={wrap}
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={`${DESKTOP_LINK} cursor-pointer gap-1.5 ${activeInside ? "underline" : ""}`}
      >
        Více
        <Icon name="chevron" size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        id={listId}
        hidden={!open}
        className="absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-card border border-line-strong bg-paper p-2"
      >
        {items.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                data-more-item
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center rounded-[10px] px-4 text-lg font-semibold text-ink no-underline decoration-2 underline-offset-[6px] hover:bg-sage-soft ${
                  active ? "underline" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MobileMenu({ links, more, brand, pathname }: { links: NavLink[]; more: NavLink[]; brand: ReactNode; pathname: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function closeAndReturn() {
      setOpen(false);
      toggle.current?.focus();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAndReturn();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const inside = panel.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    }
    // Když se okno roztáhne na desktop, mobilní menu zavřeme.
    const mq = window.matchMedia("(min-width: 900px)");
    function onMq() {
      if (mq.matches) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const all = [...links, ...more];

  return (
    <>
      <button
        ref={toggle}
        type="button"
        aria-label="Otevřít menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-stone text-ink min-[900px]:hidden"
      >
        <Icon name="menu" size={24} />
      </button>

      {open && (
        <div
          ref={panel}
          id="mobilni-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu webu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-sand min-[900px]:hidden"
          onClickCapture={(e) => {
            if ((e.target as HTMLElement).closest("a[href]")) setOpen(false);
          }}
        >
          <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-[clamp(16px,4vw,40px)]">
            {brand}
            <button
              type="button"
              data-autofocus
              aria-label="Zavřít menu"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
              className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-stone text-ink"
            >
              <Icon name="close" size={24} />
            </button>
          </div>
          <nav aria-label="Hlavní navigace" className="px-[clamp(16px,4vw,40px)] pt-2">
            <ul>
              {all.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href} className="border-b border-line">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-14 items-center font-serif text-2xl font-semibold text-ink no-underline decoration-2 underline-offset-[6px] ${active ? "underline" : ""}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col items-stretch gap-2 px-[clamp(16px,4vw,40px)] pb-8 pt-8">
            <Button href="/studie" variant="secondary">
              Číst a připomínkovat studii
            </Button>
            <TextLink href="/vstup" className="inline-flex min-h-12 items-center justify-center">
              Přihlášení pro tým
            </TextLink>
          </div>
        </div>
      )}
    </>
  );
}
