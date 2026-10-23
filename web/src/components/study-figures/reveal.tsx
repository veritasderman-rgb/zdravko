"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Obal, který přidá třídu `is-visible`, jakmile se obrázek dostane do zorného pole.
 * Animace se vážou na `.fig-animate.is-visible …` v globals.css a respektují
 * `prefers-reduced-motion` (tam se nic nehýbe a vše je hned ve výsledném stavu).
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fig-animate ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
