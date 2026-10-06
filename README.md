# Jason Wei — portfolio

Static rebuild of [jweii.com](https://jweii.com). Next.js (App Router) exports a plain site that can be hosted on Vercel’s free Hobby plan. There is no database and no contact backend.

## Edit the site

### Intro, résumé, and contact

Open [`content/profile.json`](content/profile.json).

- `headline`, `role`, `team`, `company`, and `location` are the hero and the top of About.
- `summary` is the short intro. `bio` is the longer About copy.
- `experience`, `education`, `skills`, and `honors` are lists. Add an object, or add a string to a `bullets` or `items` array. Leave `end` as `""` when you only know the start date. Leave `bullets` as `[]` when you don’t have them yet — the page hides an empty list.
- `email`, `links.linkedin`, and `links.github` are the only contact methods. The old footer phone number is intentionally not on the site.
- `resume` points at the PDF in `public/resume/`. The file in the repo is the November 19, 2024 résumé from the old site. Drop a newer PDF in `public/resume/` and update `href` and `date`.

### Projects

Each project is a Markdown file in [`content/projects/`](content/projects/). The filename is the URL: `content/projects/my-new-project.md` becomes `https://jweii.com/my-new-project/`.

```md
---
title: "Cold plate leak test"
date: "2024-03-02"
excerpt: "One or two sentences for the card and the search description."
featured: false
cover: "/media/files/your-image.webp"
categories:
  - name: "Gaucho Racing"
    slug: "gaucho-racing"
tags:
  - name: "Liquid Cooling"
    slug: "liquid-cooling"
aliases: []
---

Write the project here.

![Cold plate on the mill](/media/files/your-image.webp)
```

- `date` is `YYYY-MM-DD`. Use `YYYY-MM` if you only know the month.
- `featured: true` plus `featureRank` (1, 2, 3…) puts it on the homepage. Lower rank comes first.
- `categories` and `tags` also create `/category/…` and `/tag/…` pages. Reuse an existing `slug` so the project shows up on that archive.
- Put images and video in `public/media/` and link them from the root, like `/media/files/name.webp`.
- A line that is only “To be updated” is the original WordPress text. Replace it when you have the write-up.

### Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run build` writes the static site to `out/`.

## Import into Vercel

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that owns this repo.
2. **Add New… → Project** and import `Jayweiii/Jweii-portfolio`.
3. Framework preset: **Next.js**. Leave the build command as `next build` (or `npm run build`). Vercel detects the static export from `output: "export"` in `next.config.ts` and publishes the `out/` directory.
4. Deploy. The Hobby plan is enough: the site is static HTML, CSS, and files. There are no serverless functions. The contact link is `mailto:`.

## Point jweii.com at Vercel

The live WordPress site is behind Cloudflare. Change DNS wherever `jweii.com` is managed (likely that Cloudflare account).

1. In the Vercel project, open **Settings → Domains** and add `jweii.com` and `www.jweii.com`.
2. Vercel shows the records to create. They are usually:
   - `A` record on `@` → `76.76.21.21`
   - `CNAME` record on `www` → `cname.vercel-dns.com`
3. Replace the old records that point at the DigitalOcean droplet. If both exist, the domain can keep serving WordPress.
4. On Cloudflare, set those records to **DNS only** (grey cloud) while the certificate is issued. An orange-cloud proxy in front of Vercel often fights HTTPS. After Vercel says the domain is valid, you can leave the proxy off.
5. In Vercel, set `www.jweii.com` to redirect to `jweii.com` (or the other way around). Vercel offers this on the domain settings page.
6. When `https://jweii.com` shows this site, the DigitalOcean droplet can be powered off.

Old WordPress paths are the same paths here (`/about-me/`, `/projects/`, each project slug, `/category/…`, `/tag/…`). Two renamed project URLs, and `/page/2/` and `/page/3/`, redirect in [`vercel.json`](vercel.json):

- `/fsae-electric-liquid-cooling-design/` → `/fsae-gr24-battery-cooling-cold-plate-leak-test/`
- `/fsae-battery-pack-design/` → `/fsae-gr23-battery-segment-design/`
- `/page/2/` and `/page/3/` → `/projects/`

## What the crawl could not get

The WordPress REST API (`/wp-json/wp/v2/pages`, `/posts`, `/media`), the RSS feed, and `robots.txt` all returned **Error establishing a database connection**. The HTML pages that Cloudflare still had cached were crawled instead.

- The XML sitemap was generated on **January 8, 2024**. Blog index pages `/page/2/` and `/page/3/` were cached copies of the same three newest posts, not older entries.
- Every public post linked from that sitemap, the projects page, and the category and tag archives was saved, including **FSAE GR24 Battery Pack Design** (November 19, 2024), which is newer than the sitemap.
- These posts are only the sentence **“To be updated”** on the live site, plus a cover image when one existed: First PC Build, First 3D Printer Build, Provisional Patent on Magnetic Desk Attachment, 3D Printed Face Shield, OctoPrint, Blender Donut, ABS Acetone Smoothing, Fume Hood Sash Replacement, Fruit Fly Balance Organ, Raman Spectroscopy Light Shield, Silicone 3D Printer, FSAE Precharge & Discharge Circuit, FSAE Motor & Transmission Mounting, and FSAE Electric Blender Rendering. First PC Build, First 3D Printer Build, and the provisional patent had no image in the page or the sitemap.
- If a full write-up exists only as a draft, a private post, or a row in the broken database, it was not reachable. In WordPress admin, use **Tools → Export** and copy anything missing into a new file under `content/projects/`.
- The GR24 battery pack and module posts embed diagrams from Google Slides. Those image URLs returned 403, so the diagrams are not in the repo. The slide text is still in the Markdown. If you still have the deck, export the slides into `public/media/` and replace the missing figures.
- Photos that sit in the Media Library but are not embedded in a public page were not downloaded. If something is missing, copy it out of `wp-content/uploads` on the droplet.
- The public contact email on the old site is `jwei@ucsb.edu` (Cloudflare-obfuscated in the footer). It is on the new site because that is what the current site publishes. Change `email` in `content/profile.json` if that mailbox is dead. The phone number was not copied over.
- The résumé PDF is the November 19, 2024 file. It does not include the full-time Tesla role (July 2025 – present). Export a current résumé when you have one.
