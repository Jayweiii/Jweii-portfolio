import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link href="/" className="font-display text-xl tracking-tight">
          Jason Wei
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          <Link href="/projects/" className="px-3 py-2 hover:text-accent">
            Projects
          </Link>
          <Link href="/about-me/" className="px-3 py-2 hover:text-accent">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
