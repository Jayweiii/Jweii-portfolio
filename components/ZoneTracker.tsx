"use client";

import { useEffect, useRef } from "react";

const COLUMNS = 8;
const ROWS = "ABCDEF";

/**
 * Desktop only: as the pointer moves, the sheet's zone markers light up and the
 * corner shows the grid reference (like "C4"), the way you'd call out a spot on a drawing.
 */
export function ZoneTracker() {
  const readout = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const sheet = document.querySelector<HTMLElement>(".sheet");
    if (!sheet) return;
    let frame = 0;
    let last = "";

    const clear = () => {
      sheet.querySelectorAll(".zones .is-on").forEach((el) => el.classList.remove("is-on"));
      if (readout.current) readout.current.textContent = "";
      last = "";
    };

    const onMove = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = sheet.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return clear();
        const col = Math.min(COLUMNS - 1, Math.floor(x * COLUMNS));
        const row = Math.min(ROWS.length - 1, Math.floor(y * ROWS.length));
        const key = `${row}-${col}`;
        if (key === last) return;
        clear();
        last = key;
        sheet.querySelectorAll(`[data-col="${col}"], [data-row="${row}"]`).forEach((el) => el.classList.add("is-on"));
        if (readout.current) readout.current.textContent = `${ROWS[row]}${COLUMNS - col}`;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", clear);
    };
  }, []);

  return <span ref={readout} aria-hidden="true" className="zone-readout" />;
}
