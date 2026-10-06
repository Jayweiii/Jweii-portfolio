---
title: "FSAE GR24 Battery Module Design"
date: "2023-12-20"
excerpt: "16s3p segment architecture with wire-bonded fusible links for each parallel cell."
source: "https://jweii.com/fsae-gr24-battery-segment-design/"
featured: true
featureRank: 1
cover: "/media/files/86365484b3e9.webp"
categories:
  - name: "Gaucho Racing"
    slug: "gaucho-racing"
tags: []
aliases: []
---

<figure>
<img src="/media/files/86365484b3e9.webp" width="1800" height="1350" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/6c70fe24eb82.webp" width="1800" height="1012" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/230cc09588b8.webp" width="1800" height="842" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/8f24cad7eb39.webp" width="1800" height="1012" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/34a48a8546d6.webp" width="821" height="400" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/e662aada6fdd.webp" width="583" height="440" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/a213799b5709.webp" width="666" height="500" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/ae20880aa982.webp" width="765" height="448" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/ae82faad867f.webp" width="821" height="490" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/57066035bd8e.webp" width="800" height="478" alt="FSAE GR24 Battery Module Design" />
</figure>

<figure>
<img src="/media/files/7b8c805d5091.webp" width="831" height="624" alt="FSAE GR24 Battery Module Design" />
</figure>

## Key Rule Requirements

- Max segment voltage – 120V (EV5.1)
- Max segment energy – 6MJ (EV5.1)
- Electrically insulated with non flammable material on top and on the side of each segment (EV5.2)
- Segments connected using positively locking, tool-less maintenance plugs (EV5.3)
- Each parallel cell needs to be fused (EV6.6)

Design Decisions:

- 16s3p segment architecture
  - Each ADI BMS IC can handle 8 voltage channels
- Wire bonded fusible links for each parallel cell
  - Fully CNC’d cell connections
- No cooling necessary
- Fiberglass panel insulation on the sides, kapton film insulation on top and bottom
- Cells potted with electrically insulating, thermally conductive epoxy

<figure>
<img src="/media/files/8d5c5cdf1bb5.webp" width="1772" height="762" alt="image.png" />
</figure>

<figure>
<img src="/media/files/16425cc503b1.webp" width="1680" height="1260" alt="IMG_5568.jpg" />
</figure>

<figure>
<img src="/media/files/861481ee578a.webp" width="1600" height="2134" alt="IMG_5874.jpg" />
</figure>

[https://gr-wiki-public.s3.amazonaws.com/uploads/images/gallery/2024-10/img-5568.jpg](https://gr-wiki-public.s3.amazonaws.com/uploads/images/gallery/2024-10/img-5568.jpg)

## Fusible Links

Power Loads

- 135A max current (6 seconds during acceleration event)
- 55A Continuous RMS Current (150 seconds during autocross)

Design Decisions:

- 63A [main fuse](https://www.mouser.com/datasheet/2/643/ds_CP_0AKK_series-3007019.pdf) (we want this to blow first)
- [35mm^2 / 2 gauge](https://www.iewc.com/catalog/wire-and-cable/automotive-wire-and-cable/battery-cable/electric-and-hybrid-vehicle/000000000032051072) wire
  - Bend radius is 43mm (½ distance between segments) in design, which is 4 times 11mm (wire OD). This is less than the recommended 8 times wire OD so need to keep an eye on cable kink, strain, and wear
- 8mm SURLOK connectors

<figure>
<img src="/media/files/24dc0d0a06bf.webp" width="1223" height="628" alt="image.png" />
</figure>

**Fusible Links:**

Motivation – Why Wire Bonding?

- No heat interaction with Lithium
  - Compared to spot welding
- Integrated fusing (details in following slide)
- Reduced contact resistance
- Quick and safe automated process
- Quality Control (Hesse Mechatronics)

Requirements

- Wire bonds rated for max of 1.75x Max cell discharge current (45A cell, 80A fuse)
  - Spec from FSAE Judge
- Specify wire diameter, wire length
- Have Fast and Slow fuse blow out times (160A, 80A)
- 4N Aluminum Wire (99.99 Purity)
  - Impurities change resistance

|  | Blow Time |
| --- | --- |
| Current Level 1 (80A) | 30 &lt; t &lt; 300 sec |
| Current Level 2 | 5 sec &lt; t &lt; 15 sec |
| Current Level 3 | 0.2 sec &lt; t &lt; 1 sec |
| Current Level 4 (160A) | 0.05 sec &lt; t &lt; 0.15 sec |

MATLAB Simulation of 1mm Round Wire
Lumped Capacitance Model w/ Temperature Dependence:

Fuse Blowout Times for 42mm wire at various diameters

Test setup:

<figure>
<img src="/media/files/02dd61997e5c.webp" width="1778" height="914" alt="image.png" />
</figure>

<figure>
<img src="/media/files/493b7929fa8f.webp" width="1800" height="1350" alt="IMG_0637.jpg" />
</figure>
