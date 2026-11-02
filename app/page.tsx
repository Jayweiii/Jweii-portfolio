import { Bom, partNo, type BomRow } from "@/components/Bom";
import { ZoomLink } from "@/components/Zoom";
import { getFeaturedProjects, getProjects } from "@/lib/content";
import { profile } from "@/lib/profile";

const LETTERS = "ABCDEFGH";
const FEATURED_DETAILS = 4;

type Detail = {
  letter: string;
  label: string;
  href: string;
  image?: string;
  caption?: string;
};

export default function HomePage() {
  const projects = getProjects();
  const featured = getFeaturedProjects().slice(0, FEATURED_DETAILS);

  const details: Detail[] = [
    { letter: "A", label: "About", href: "/about-me/", image: profile.portrait.src },
    { letter: "B", label: "Projects", href: "/projects/", caption: `${projects.length} items` },
    ...featured.map((p, i) => ({
      letter: LETTERS[i + 2],
      label: p.title,
      href: `/${p.slug}/`,
      image: p.cover,
    })),
  ];

  const rows: BomRow[] = [
    { item: "A", part: "JW-003", description: "About", year: "Sh. 3", href: "/about-me/" },
    { item: "B", part: "JW-002", description: "Projects", year: "Sh. 2", href: "/projects/" },
    ...featured.map((p, i) => ({
      item: LETTERS[i + 2],
      part: partNo(projects.findIndex((x) => x.slug === p.slug)),
      description: p.title,
      year: p.date ? p.date.slice(0, 4) : undefined,
      href: `/${p.slug}/`,
    })),
  ];

  return (
    <div className="home-grid">
      <section aria-labelledby="sheet-heading" className="home-drawing relative min-h-0">
        <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0" />
        <div className="relative flex h-full flex-col px-4 py-3">
          <div className="home-intro">
            <h1 id="sheet-heading" className="font-display text-3xl leading-none tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="hero-summary mt-2 max-w-xl text-sm leading-snug">{profile.summary}</p>
            <p className="mt-1 text-xs text-muted">
              {profile.role}, {profile.team} · {profile.location}
            </p>
          </div>
          <ul className="details-grid">
            {details.map((d) => (
              <li key={d.href}>
                <ZoomLink href={d.href} className="detail-link group" aria-label={`Detail ${d.letter}: ${d.label}`}>
                  <span className="detail-ring">
                    <span className="detail-circle bg-wash">
                      {d.image ? (
                        <img src={d.image} alt="" loading="eager" decoding="async" className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full w-full place-items-center p-2 text-center font-display leading-tight">
                          {d.caption ?? d.label}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="detail-caption">
                    <span className="text-accent">Detail {d.letter}</span>
                    <span className="detail-title">{d.label}</span>
                  </span>
                </ZoomLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="bom-heading" className="home-bom min-h-0 border-ink/70">
        <h2
          id="bom-heading"
          className="mb-2 font-mono text-[0.65rem] font-normal uppercase tracking-[0.18em] text-accent"
        >
          Bill of materials
        </h2>
        <Bom rows={rows} caption="Sheet contents" yearLabel="Qty / Yr" compact />
        <p className="mt-2 text-right text-xs">
          <ZoomLink href="/projects/" className="underline decoration-line underline-offset-4 hover:text-accent">
            All {projects.length} projects →
          </ZoomLink>
        </p>
      </section>
    </div>
  );
}
