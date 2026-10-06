---
title: "FSAE GR24 Battery Cooling Cold Plate Leak Test"
date: "2023-12-25"
excerpt: "Battery water cooling was chosen instead of air cooling for two main reasons:"
source: "https://jweii.com/fsae-gr24-battery-cooling-cold-plate-leak-test/"
featured: true
featureRank: 3
cover: "/media/files/064aa4d423e3.webp"
categories:
  - name: "Gaucho Racing"
    slug: "gaucho-racing"
tags:
  - name: "CAD"
    slug: "cad"
  - name: "CNC Mill"
    slug: "cnc-mill"
  - name: "Liquid Cooling"
    slug: "liquid-cooling"
  - name: "Simulation"
    slug: "simulation"
aliases:
  - "/fsae-electric-liquid-cooling-design/"
---

## Purpose

Battery water cooling was chosen instead of air cooling for two main reasons:

1. Ease of manufacturing – since the cells are designed to be wire bonded on the top surface, that leaves the entire bottom surface of the cell available for cooling. Cooling the sides of the cells will be more difficult in terms of manufacturing, as using bottom cooling allows us to pot the cells in place.
2. Improved cell temperature uniformity – the thermal limit of the is dependent on the hottest cell. The greatest temperature difference of a water cooled pack is due to the difference in inlet and outlet coolant temperatures. However, in an air cooled pack, hot spots may be present in areas with poor airflow, which can be difficult to design for

The risks and cons of water cooling are:

1. Reliability – ensuring water does not leak
2. Increased weight – added from water, tubing, cold plate, pump

## Method

A basic cold plate was designed and machined to cool the bottom ends of the cells, consisting of a single large channel with no internal fin geometries.

<figure>
<img src="/media/files/6c70fe24eb82.webp" width="1800" height="1012" alt="Method" />
</figure>

The gasket is laser cut from rubber and slots into a machined groove.

<figure>
<img src="/media/files/981c4af405d0.webp" width="831" height="1108" alt="Method" />
</figure>

A quick disconnect fitting is at the inlet and outlet of the cold plate.

<figure>
<img src="/media/files/5a7c50192b51.webp" width="831" height="1108" alt="Method" />
</figure>

The test setup consists of the cold plate, pump, reservoir, two pressure gauges (at inlet and outlet), and a flow meter.

<figure>
<img src="/media/files/064aa4d423e3.webp" width="741" height="1318" alt="Method" />
</figure>

Here is a video of the setup running:

<video controls playsinline preload="metadata" width="960" height="1706" src="/media/files/7d29a72fd936.mp4"></video>

## Preliminary Conclusions

- Soft tubing is a major leakage risk in the quick disconnects (if it bends)
  - Small diameter soft tubing did not leak in the barb fittings, although the large diameter pump barb fitting did slightly leak (needs a ziptie to lock the tubing in place)
- Slight leak in the gasket, reasons being it not being seated properly in the machined slot (gasket width needs to be reduced) and two of the tapped holes for clamping the gasket were not tapped correctly (had to use a clamp)
- Flow meter was not specced out correctly for the flow rate (exceeded what the flow meter could measure)
- No measurable pressure drop across the cold plate, which was predicted by a flow simulation
  - Can add more internal fin geometries in the cold plate to increase heat transfer

<figure>
<img src="/media/files/65871b7f8db1.webp" width="1800" height="1144" alt="Minimal pressure drop across cold plate (simulated in Solidworks Flow Sim)" />
<figcaption>Minimal pressure drop across cold plate (simulated in Solidworks Flow Sim)</figcaption>
</figure>

## Next Steps

- Explore hard line tubing for the quick disconnect fitting
- Wire bond batteries on top of cold plate and run a discharge test to characterize heat transfer rate
- Purchase correct flow meter
- Redesign cold plate with more internal geometries to promote heat transfer and turbulent flow
