"use client";

import Image from "next/image";
import { useState } from "react";

type AppId = "projects" | "classes" | "gallery" | "games" | "about";

//Apps available on the DS
const APPS: { id: AppId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "classes", label: "Classes" },
  { id: "gallery", label: "Gallery" },
  { id: "games", label: "Mini-Games" },
  { id: "about", label: "About" },
];

// Button hit boxes
const BUTTONS = [
  // D-pad
  { id: "UP",    left: "15.20%", top: "56.91%", width: "4.50%", height: "4.75%" },
  { id: "DOWN",  left: "15.20%", top: "64.77%", width: "4.50%", height: "4.75%" },
  { id: "LEFT",  left: "11.50%",  top: "61.29%", width: "4.75%", height: "4.50%" },
  { id: "RIGHT", left: "19.50%", top: "61.29%", width: "4.75%", height: "4.50%" },

  // Face buttons (diamond)
  { id: "X", left: "79.55%", top: "55.81%", width: "4.75%", height: "4.75%" },
  { id: "A", left: "84.25%", top: "60.80%", width: "4.75%", height: "4.75%" },
  { id: "Y", left: "74.75%", top: "60.80%", width: "4.75%", height: "4.75%" },
  { id: "B", left: "79.55%", top: "65.50%", width: "4.75%", height: "4.75%" },

  // Start / Select (small buttons)
  { id: "START",  left: "74.12%", top: "75.59%", width: "4.12%", height: "4.12%" },
  { id: "SELECT", left: "74.12%", top: "81.66%", width: "4.12%", height: "4.12%" },

  // Power button
  { id: "POWER", left: "17.85%", top: "77.75%", width: "5.80%", height: "5.80%" },
] as const;

// Screen areas as % of the full 800x772 image
const TOP = { left: "27.75%", top: "13.34%", width: "44.38%", height: "29.02%" };
const BOTTOM = { left: "29.13%", top: "54.27%", width: "41.38%", height: "29.53%" };

export default function DS() {
  const [active, setActive] = useState<AppId>("projects");
  const label = APPS.find(a => a.id === active)?.label ?? active;

  return (
    <div className="w-full max-w-[560px]">
      <div className="relative w-full" style={{ aspectRatio: "800 / 772" }}>
        {/* Top Screen Content */}
        <div className="absolute bg-black/90 overflow-hidden" style={TOP}>
          <div className="h-full w-full flex items-center justify-center text-center p-3">
            <div>
              <div className="text-xl font-semibold">{label}</div>
              <div className="text-white/60 text-sm mt-2">Top screen content!</div>
            </div>
          </div>
        </div>

        {/* Bottom screen content (touch UI) */}
        <div className="absolute bg-black/90 overflow-hidden" style={BOTTOM}>
          <div className="h-full w-full p-3 grid grid-cols-2 gap-2">
            {APPS.map(a => (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition
                  ${a.id === active ? "bg-white/15 border-white/30" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTON HITBOXES */}
        {BUTTONS.map(b => (
          <button
            key={b.id}
            aria-label={b.id}
            onClick={() => console.log("pressed", b.id)}
            className="absolute bg-transparent"
            style={{
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height,
              zIndex: 30,
            }}
          />
        ))}

        
        {/* DS overlay (USE CUTOUT VERSION) */}
        <Image
          src="/assets/ds/ds-frame.png"
          alt="DS frame"
          fill
          priority
          className="object-contain pointer-events-none select-none"
        /> 
        
      </div>
    </div>
  );
}
