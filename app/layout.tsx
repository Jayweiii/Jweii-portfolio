import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SheetFrame } from "@/components/SheetFrame";
import { SiteHeader } from "@/components/SiteHeader";
import { themeScript } from "@/components/ThemeToggle";
import { TitleBlock } from "@/components/TitleBlock";
import { profile } from "@/lib/profile";
import { sheetIndex } from "@/lib/sheets";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const title = "Jason Wei · Battery Engineering at Tesla";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d2744" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jweii.com"),
  title: {
    default: title,
    template: "%s · Jason Wei",
  },
  description: profile.summary,
  authors: [{ name: profile.name, url: "https://jweii.com" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jweii.com/",
    siteName: "Jason Wei",
    title,
    description: profile.summary,
    images: [{ url: profile.portrait.src, alt: profile.portrait.alt, width: profile.portrait.width, height: profile.portrait.height }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.summary,
    images: [profile.portrait.src],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: `${profile.role}, ${profile.team}`,
    worksFor: { "@type": "Organization", name: profile.company },
    url: "https://jweii.com/",
    image: `https://jweii.com${profile.portrait.src}`,
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Palo Alto",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    sameAs: [profile.links.linkedin, profile.links.github],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of California, Santa Barbara",
    },
    description: profile.summary,
  };

  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SheetFrame>
          <SiteHeader name={profile.name} resume={profile.resume.href} />
          <main id="content" className="flex-1">
            {children}
          </main>
          <TitleBlock
            name={profile.name}
            email={profile.email}
            linkedin={profile.links.linkedin}
            github={profile.links.github}
            location={profile.location}
            sheets={sheetIndex()}
            revision={String(new Date().getFullYear())}
          />
        </SheetFrame>
      </body>
    </html>
  );
}
