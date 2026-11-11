import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <PageHeader dwg="Dwg JW-404" kicker="Sheet missing" title="Page not found" lead="There is no sheet at that address. It may have moved when the site was rebuilt.">
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Back to sheet 1
        </Link>
        <Link href="/projects/" className="btn btn-secondary">
          Parts list
        </Link>
      </div>
    </PageHeader>
  );
}
