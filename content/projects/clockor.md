---
title: "Clockor"
date: "2026-11"
excerpt: "In progress. A hybrid motor clock: a spinning POV LED bar for the minute hand and a slow physical hour hand."
featured: true
featureRank: 1
pinned: false
link: "https://github.com/Jayweiii/Clockor"
linkLabel: "Open repo"
categories:
  - name: "Personal"
    slug: "personal"
tags: []
aliases: []
---

Status: in progress. Clockor is a hybrid dual-mode clock. The minute hand is a spinning persistence-of-vision LED bar, and the hour hand is a slow physical hand. I chose hybrid hands so the POV graphics stay simple and a normal clock still reads at a glance.

**Mechanics.** The minute hand is a counterbalanced LED PCB, about 150 mm long, with 36 APA102-2020 LEDs on a solid minute shaft. A Furitek KOMODO 2204 1400KV BLDC motor drives it at roughly 600–1200 RPM from about 12 V, with SimpleFOC and an AS5600 encoder for parking. The hour hand is driven by a 28BYJ-48 stepper, off axis, through a 1:1 thin belt or spur, and sits on a short stub axle at the center of a clear acrylic diffuser dial. The spinning bar stays behind the dial, with at least 5 mm of axial clearance, and only the hour hand sits in front. Power reaches the spinning board through a SenRing G012 slip ring.

**Modes.** In static clock mode the motor parks the bar at the minute angle with the LEDs lit as a glowing minute hand, while the stepper tracks the hour. In graphics mode the bar spins and the hour hand holds or creeps slowly.

**Electronics.** Two KiCad boards: a stationary base controller (ESP32-S3, power, motor drivers) and the rotating minute-hand board (ESP32-C3, LED driver). A once-per-revolution hall sensor gives POV sync, and ESP-NOW carries the frame data.

**Where it stands.** Both boards pass ERC with zero errors, and the footprints are placed with no shorts, but the PCBs are not yet production-routed. The firmware interlocks are specified in the docs; the code is not written yet.

[Open repo](https://github.com/Jayweiii/Clockor)
