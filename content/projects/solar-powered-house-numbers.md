---
title: "Solar Powered House Numbers"
date: "2022-10-01"
excerpt: "I built a battery powered house number sign that lights up at night and is recharged during the day using a solar panel."
source: "https://jweii.com/solar-powered-house-numbers/"
featured: false
cover: "/media/files/23d34cf06558.webp"
categories:
  - name: "Personal"
    slug: "personal"
tags:
  - name: "3D Print"
    slug: "3d-print"
  - name: "CAD"
    slug: "cad"
  - name: "Circuit"
    slug: "circuit"
  - name: "CNC Mill"
    slug: "cnc-mill"
  - name: "Render"
    slug: "render"
aliases: []
---

<figure>
<img src="/media/files/5e63cc0b7a42.webp" width="1800" height="1350" alt="Solar Powered House Numbers" />
</figure>

## Introduction

I built a battery powered house number sign that lights up at night and is recharged during the day using a solar panel.

## Process

CAD render

<figure>
<img src="/media/files/ca56f8a7874d.webp" width="1080" height="834" alt="Process" />
</figure>

The numbers were laser cut from 1/8″ acrylic

<video controls playsinline preload="metadata" width="1280" height="720" src="/media/files/2980b6622ac9.mp4"></video>

The number cutouts on the back plate of the sign was scribed and milled from an aluminum bar. This is to enhance the diffusion and reflection of the embedded LEDs.

<video controls playsinline preload="metadata" width="1280" height="720" src="/media/files/c5595303523f.mp4"></video>

<video controls playsinline preload="metadata" width="960" height="540" src="/media/files/a9f75c0739de.mp4"></video>

I finished the aluminum with an orbital sander with low grit for a unique surface finish

<video controls playsinline preload="metadata" width="960" height="540" src="/media/files/0587ec3a0b99.mp4"></video>

I constructed a simple circuit using a PNP transistor on a breadboard that charges the batteries with a solar panel during the day, and lights up the embedded LEDs during the night

## Conclusion

<figure>
<img src="/media/files/f0d371774ba8.webp" width="1800" height="1350" alt="Conclusion" />
</figure>

Although I am very proud of my work, there is a major flaw with this design in that the LEDs are not diffused enough. As you can see below, it is hard to read the numbers from a distance:

<figure>
<img src="/media/files/e74744ea7553.webp" width="1800" height="1350" alt="Conclusion" />
</figure>

If I were to redo this, I would explore drilling blind holes into the acrylic so the LEDs can protrude more and transmit their light at greater angles.
