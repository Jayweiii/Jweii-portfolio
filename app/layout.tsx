import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { profile } from "@/lib/profile";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const title = "Jason Wei · Battery Engineering at Tesla";

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
    images: [{ url: "/media/portrait.webp", alt: "Portrait of Jason Wei" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.summary,
    images: ["/media/portrait.webp"],
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
    image: "https://jweii.com/media/portrait.webp",
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
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
