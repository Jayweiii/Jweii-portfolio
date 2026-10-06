---
title: "FSAE GR23 Battery Segment Design & Manufacturing SOP"
date: "2023-10-12"
excerpt: "This SOP provides a guide to safely manufacture and assemble battery segments of the GR23 electrical vehicle"
source: "https://jweii.com/fsae-gr23-battery-segment-design/"
featured: true
featureRank: 4
cover: "/media/files/1ba5cd0f7173.webp"
categories:
  - name: "Gaucho Racing"
    slug: "gaucho-racing"
tags:
  - name: "CAD"
    slug: "cad"
  - name: "Render"
    slug: "render"
aliases:
  - "/fsae-battery-pack-design/"
---

<figure>
<img src="/media/files/1ba5cd0f7173.webp" width="504" height="334" alt="FSAE GR23 Battery Segment Design &amp; Manufacturing SOP" />
</figure>

## Introduction

This SOP provides a guide to safely manufacture and assemble battery segments of the GR23 electrical vehicle

## Overview

- Safety considerations, how they can occur, and how to avoid electrical accidents
- Battery segment design
- Necessary materials, tools, and equipment
- Machining of insulation panels
- Assembly of Enepaq modules within insulation

## Safety Considerations

- Electrical shock &amp; arc flash
  - There are two primary ways that direct current electrical injury can occur:
    1. Body completing the loop in a high voltage circuit (touching positive and negative terminals of a high potential battery segment)
    2. Non-insulated tool or a conductive material completes the circuit in a medium to high voltage circuit, generating an explosive arc that can produce intense heat
- Electrical Insulating PPE
  - Referencing this [Electrical Insulating PPE Guide](https://drive.google.com/file/d/1WaE5zUF_ONd5w97KBsFAAIgpMukKw4gw/view?usp=sharing) and [NFPA 70E PPE](https://drive.google.com/file/d/10a0mtayN_YjYS8mw8pcqEAQBuuY6iT1I/view?usp=sharing), working with electric potentials between 50-750VDC (GR23 battery segment is 110V max voltage, entire battery pack is 546V max voltage) requires:
    - electrically insulating class 00 gloves
    - nonconductive safety glasses
    - [insulated tools](https://www.mcmaster.com/7315A71/)
    - long sleeve shirt &amp; pants
    - closed toed shoes
    - [electrically insulating mat](https://www.mcmaster.com/6893T13/)
    - arc-flash face shield
- Workspace
  - As mentioned above, ensure that no non-insulated tools can fall across battery terminals or be accidentally used (remove all non-insulated tools that are magnetically attached above the workbench)
  - Workspace and ground should be covered with electrically insulating mats
  - No machining of metals should occur while battery segment terminals are exposed
  - Machining Fiberglass
    - Machining fiberglass can produce fine resin and glass particles that can be harmful if inhaled
      - Keep particles contained in CNC router enclosure
        - Use vacuum attachment
      - Wear masks
      - Wipe up particles often

<figure>
<img src="/media/files/4e9a1713da1c.webp" width="150" height="284" alt="Safety Considerations" />
</figure>

<figure>
<img src="/media/files/bb3708a54e18.webp" width="200" height="124" alt="Safety Considerations" />
</figure>

## Battery Segment Design

<figure>
<img src="/media/files/d498395aa7a0.webp" width="996" height="592" alt="Battery Segment Design" />
</figure>

26s5p li-ion cells per segment comprised of Enepaq 1x5p Sony VTC6 modules

## Necessary Materials, Tools, and Equipment

- Electrical Insulating PPE
  - Referencing this [Electrical Insulating PPE Guide](https://drive.google.com/file/d/1WaE5zUF_ONd5w97KBsFAAIgpMukKw4gw/view?usp=sharing) and [NFPA 70E PPE](https://drive.google.com/file/d/10a0mtayN_YjYS8mw8pcqEAQBuuY6iT1I/view?usp=sharing), working with electric potentials between 50-750VDC (GR23 battery segment is 110V max voltage, entire battery pack is 546V max voltage) requires:
    - electrically insulating class 00 gloves
    - nonconductive safety glasses
    - [insulated tools](https://www.mcmaster.com/7315A71/)
    - long sleeve shirt &amp; pants
    - closed toed shoes
    - [electrically insulating mat](https://www.mcmaster.com/6893T13/)
    - arc-flash face shield
- Drill bits &amp; end mills for insulation panel machining
- Epoxy for assembling panels
- Wires &amp; solder

## Machining of Insulation Panels

1. Fixture panels, program cam, and set up tools on ShopBot Router referencing [ShopBot SOP](http://microfluidics.cnsi.ucsb.edu/wiki/doku.php?id=shopbotdesktoptrainingsop)

<figure>
<img src="/media/files/2f041600e171.webp" width="400" height="300" alt="insulationcnc.jpg" />
</figure>

2. Set up vacuum attachment and wear masks to minimize inhalation of fine fiberglass particles

3. File edges of panels to remove sharp glass fibers

## Assembly of Enepaq modules within insulation

1. Insert modules with correct polarities and use epoxy to bond base and side panels of segment

<figure>
<img src="/media/files/a05c2dbfefde.webp" width="1800" height="2400" alt="Assembly of Enepaq modules within insulation" />
</figure>

<figure>
<img src="/media/files/a3dcf7b240ec.webp" width="421" height="318" alt="Assembly of Enepaq modules within insulation" />
</figure>

1. Wear proper PPE (listed in safety considerations section); those without PPE should remain five feet away and connect modules together using bolts and busbars
  - Cover work surface and ground with electrically insulating mat and use insulated tools
  - Attach voltage taps under bolt heads using solder if necessary (onto copper washers)
  - Attach temperature sensing wires to module xr connector
2. Route wires through holes in top panel
3. Connect voltage taps carefully and avoid short circuiting any modules

<figure>
<img src="/media/files/b70bce674e4e.webp" width="299" height="408" alt="Assembly of Enepaq modules within insulation" />
</figure>

1. Bond top panels to enclose segment

<figure>
<img src="/media/files/7b8e4ba64f7c.webp" width="1800" height="1350" alt="Assembly of Enepaq modules within insulation" />
</figure>

<figure>
<img src="/media/files/31711797d75d.webp" width="506" height="382" alt="Assembly of Enepaq modules within insulation" />
</figure>
