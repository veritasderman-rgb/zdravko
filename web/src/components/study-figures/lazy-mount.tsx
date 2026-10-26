"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Vykreslí obsah, až se blíží zornému poli (s předstihem), a do té doby drží místo.
 * Veřejná studie má přes třicet grafů; kdyby se všechny vykreslily a oživily najednou,
 * stránka by na telefonu několik sekund nereagovala. Před tiskem se vykreslí vše.
 */
// Jakmile čtenář sám posune stránkou, cíl odkazu (#kotva) už nedorovnáváme.
let userScrolled = false;
if (typeof window !== "undefined") {
  const mark = () => {
    userScrolled = true;
  };
  for (const ev of ["wheel", "touchstart", "keydown", "mousedown"]) window.addEventListener(ev, mark, { once: true, passive: true });
}

export function LazyMount({ children, minHeight = 420 }: { children: ReactNode; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    const print = () => setShow(true);
    window.addEventListener("beforeprint", print);
    return () => {
      io.disconnect();
      window.removeEventListener("beforeprint", print);
    };
  }, []);

  // Graf nad cílem odkazu po vykreslení odsune text; vrátíme čtenáře na cíl, dokud sám neposouvá.
  useEffect(() => {
    if (!show || userScrolled) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target && ref.current && ref.current.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) target.scrollIntoView({ block: "start" });
  }, [show]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }} aria-busy={!show || undefined}>
      {show ? children : null}
    </div>
  );
}
