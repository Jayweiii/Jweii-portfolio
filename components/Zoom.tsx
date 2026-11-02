"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

type Dir = "none" | "in" | "out";
type Pt = { x: number; y: number };
type Nav = { dir: Dir } & Pt;

const CENTER: Pt = { x: 50, y: 50 };
const LEAVE_MS = 280;

type Ctx = {
  nav: Nav;
  leavingFrom: string | null;
  go: (href: string, from?: HTMLElement | null) => void;
};

const ZoomContext = createContext<Ctx | null>(null);

function useZoom() {
  const ctx = useContext(ZoomContext);
  if (!ctx) throw new Error("ZoomLink must be used inside ZoomProvider");
  return ctx;
}

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Tracks where a zoom started so the detail page can grow out of its circle and
 * Back / "Full sheet" can shrink back into the same circle. Motion is skipped
 * entirely when the user prefers reduced motion.
 */
export function ZoomProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const pathRef = useRef(pathname);
  const origins = useRef<Record<string, Pt>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nav, setNav] = useState<Nav>({ dir: "none", ...CENTER });
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);

  useEffect(() => {
    pathRef.current = pathname;
    setLeavingFrom(null);
  }, [pathname]);

  // Browser Back zooms out of the page we are leaving, into its circle.
  useEffect(() => {
    const onPop = () => {
      const pt = origins.current[pathRef.current] ?? CENTER;
      setNav({ dir: "out", ...pt });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const go = useCallback(
    (href: string, from?: HTMLElement | null) => {
      const dir: Dir = href === "/" ? "out" : "in";
      let pt: Pt = CENTER;
      if (dir === "in") {
        const stage = document.getElementById("stage");
        if (stage && from) {
          const s = stage.getBoundingClientRect();
          const r = from.getBoundingClientRect();
          pt = {
            x: Math.min(100, Math.max(0, ((r.left + r.width / 2 - s.left) / s.width) * 100)),
            y: Math.min(100, Math.max(0, ((r.top + r.height / 2 - s.top) / s.height) * 100)),
          };
        }
        origins.current[href] = pt;
      } else {
        pt = origins.current[pathRef.current] ?? CENTER;
      }
      setNav({ dir, ...pt });
      if (reducedMotion()) {
        router.push(href);
        return;
      }
      setLeavingFrom(pathRef.current);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.push(href), LEAVE_MS);
    },
    [router],
  );

  const value = useMemo(() => ({ nav, leavingFrom, go }), [nav, leavingFrom, go]);
  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

type ZoomLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Internal link that zooms from its own position into the destination page. */
export function ZoomLink({ href, onClick, children, ...rest }: ZoomLinkProps) {
  const { go } = useZoom();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === "_blank" ||
      !href.startsWith("/") ||
      href.includes("#")
    ) {
      return;
    }
    e.preventDefault();
    go(href, e.currentTarget);
  };
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}

/** Fixed viewport window for the current page; the page zooms in and out inside it. */
export function Stage({ children }: { children: ReactNode }) {
  const { nav, leavingFrom } = useZoom();
  const pathname = usePathname() || "/";
  const leaving = leavingFrom === pathname;
  const cls = leaving ? `leave-${nav.dir}` : nav.dir === "none" ? "" : `enter-${nav.dir}`;
  return (
    <div id="stage" className="relative min-h-0 flex-1 overflow-hidden">
      <div
        key={pathname}
        className={`stage-page ${cls}`}
        style={{ transformOrigin: `${nav.x}% ${nav.y}%` }}
      >
        {children}
      </div>
      {pathname !== "/" ? (
        <ZoomLink
          href="/"
          className="back-to-sheet absolute right-3 top-2 z-10 inline-flex min-h-11 items-center border border-ink/70 bg-card px-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] hover:border-accent hover:text-accent"
        >
          ← Full sheet
        </ZoomLink>
      ) : null}
    </div>
  );
}

/** Shown on narrow portrait screens, where the landscape sheet does not fit. */
export function RotateHint() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="rotate-hint" role="dialog" aria-label="Rotate your device">
      <div className="max-w-xs text-center">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="mx-auto h-14 w-14 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="16" y="6" width="16" height="30" rx="2" />
          <path d="M10 40h28M34 34l4 6-4 6" />
        </svg>
        <p className="mt-4 font-display text-2xl">Rotate to landscape</p>
        <p className="mt-2 text-sm text-muted">This is a single drawing sheet and reads best sideways.</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-6 inline-flex min-h-11 items-center border border-ink px-4 text-sm hover:border-accent hover:text-accent"
        >
          Continue in portrait
        </button>
      </div>
    </div>
  );
}
