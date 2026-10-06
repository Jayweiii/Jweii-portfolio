import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-3 font-display text-5xl">Page not found</h1>
      <p className="mt-4 text-muted">That URL is not on this site.</p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm underline underline-offset-4">
        Back home
      </Link>
    </div>
  );
}
