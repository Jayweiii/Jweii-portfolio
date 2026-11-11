"use client";

import { useEffect, useState } from "react";

const KEY = "sheet-checked";

/** "Checked by" box in the title block. Visitors can sign the sheet; it's remembered on their device only. */
export function Signature() {
  const [signed, setSigned] = useState<string | null>(null);

  useEffect(() => {
    try {
      setSigned(localStorage.getItem(KEY));
    } catch {
      /* storage blocked: start unsigned */
    }
  }, []);

  function sign() {
    const date = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date());
    setSigned(date);
    try {
      localStorage.setItem(KEY, date);
    } catch {
      /* fine — it just won't be remembered */
    }
  }

  function clear() {
    setSigned(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* nothing to clear */
    }
  }

  if (!signed) {
    return (
      <button
        type="button"
        onClick={sign}
        className="inline-flex min-h-11 w-full items-center justify-between gap-3 border border-dashed border-line-strong px-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent active:translate-y-px"
      >
        <span>✎ Sign the sheet</span>
        <span aria-hidden="true" className="h-px flex-1 border-b border-dotted border-current opacity-60" />
      </button>
    );
  }

  return (
    <div className="flex min-h-11 items-center gap-3" aria-live="polite">
      <svg viewBox="0 0 100 32" className="h-9 w-24 flex-none text-accent" fill="none" stroke="currentColor" aria-hidden="true">
        <path
          className="draw"
          pathLength={1}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 24 C8 6 16 2 14 16 S20 30 26 14 S34 4 38 18 S46 28 52 12 S62 8 60 20 S66 26 72 16 C78 10 84 12 97 9"
        />
      </svg>
      <span className="min-w-0 text-xs leading-snug">
        <span className="block">Checked by you</span>
        <span className="block font-mono text-[0.68rem] text-muted">{signed}</span>
        <button type="button" onClick={clear} className="inline-flex min-h-6 items-center font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted underline underline-offset-2 hover:text-accent">
          Erase
        </button>
      </span>
    </div>
  );
}
