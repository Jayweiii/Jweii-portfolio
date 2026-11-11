"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function resolved(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Segmented toggle between the vellum (light) and blueprint (dark) sheets. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(resolved());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(resolved());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    setTheme(next);
  }

  const options: { value: Theme; label: string }[] = [
    { value: "light", label: "Vellum" },
    { value: "dark", label: "Blueprint" },
  ];

  return (
    <div role="group" aria-label="Sheet colour" className="flex border border-line-strong">
      {options.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => choose(option.value)}
            className={`min-h-11 px-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors active:translate-y-px ${
              active ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Runs before paint so a saved choice never flashes the wrong sheet. */
export const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
