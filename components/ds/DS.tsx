"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
const TOP = { left: "27.75%", top: "13.34%", width: "44.38%", height: "29.02%", zIndex: 5 };
const BOTTOM = { left: "29.13%", top: "54.27%", width: "41.38%", height: "29.53%", zIndex: 5 };

export default function DS() {
  const PAGE_SIZE = 3;
  const totalPages = Math.ceil(APPS.length / PAGE_SIZE);
  const [active, setActive] = useState<AppId>("projects");
  const [page, setPage] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const label = APPS.find(a => a.id === active)?.label ?? active;
  const appsOnPage = APPS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const goPrev = () => setPage(p => Math.max(0, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

  const playStartup = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    playStartup();
  }, []);

  const handleButton = (id: string) => {
    if (id === "POWER") {
      playStartup();
    }
    console.log("pressed", id);
  };

  return (
    <div className="w-full max-w-[560px]">
      <div className="relative w-full" style={{ aspectRatio: "800 / 772" }}>
        {/* Top Screen Content */}
        <div className="absolute bg-white overflow-hidden border border-black/10" style={TOP}>
          <div className="h-full w-full flex items-center justify-center text-center p-3 font-Rodin text-black">
            <div>
              <div className="text-xl font-semibold">{label}</div>
              <div className="text-black/70 text-sm mt-2">Top screen content!</div>
            </div>
          </div>
        </div>

        {/* Bottom screen content (touch UI) */}
        <div className="absolute bg-white overflow-hidden border border-black/10" style={BOTTOM}>
          <div className="h-full w-full p-4 flex flex-col gap-4 font-Rodin text-black">
            <div className="flex-1 flex items-center">
              <div className="flex w-full items-center gap-3">
                {page > 0 && (
                  <button
                    aria-label="Previous page"
                    onClick={goPrev}
                    className="shrink-0 rounded-full bg-black/5 border border-black/20 text-black px-3 py-3 hover:bg-black/10 transition"
                  >
                    ◀
                  </button>
                )}
                <div className="flex-1 grid grid-cols-3 gap-3">
                  {appsOnPage.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setActive(a.id)}
                      className={`aspect-square rounded-2xl border-2 bg-gradient-to-b from-white to-neutral-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.15)] text-[0.6rem] uppercase tracking-tight flex items-center justify-center text-center leading-tight transition
                        ${a.id === active ? "border-black text-black" : "border-black/20 text-black/60 hover:border-black/50"}`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
                {page < totalPages - 1 && (
                  <button
                    aria-label="Next page"
                    onClick={goNext}
                    className="shrink-0 rounded-full bg-black/5 border border-black/20 text-black px-3 py-3 hover:bg-black/10 transition"
                  >
                    ▶
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-black/60 text-xs">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <span
                  key={`page-dot-${idx}`}
                  className={`h-2.5 w-2.5 rounded-full ${idx === page ? "bg-black" : "bg-black/20"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* BUTTON HITBOXES */}
        {BUTTONS.map(b => (
          <button
            key={b.id}
            aria-label={b.id}
            onClick={() => handleButton(b.id)}
            className="absolute bg-transparent border-0 outline-none appearance-none"
            style={{
              left: b.left,
              top: b.top,
              width: b.width,
              height: b.height,
              zIndex: 30,
            }}
          />
        ))}
        <audio
          ref={audioRef}
          src="/assets/ds/nintendo-ds-startup.mp3"
          aria-hidden="true"
        />

        {/* DS overlay (USE CUTOUT VERSION) */}
        <Image
          src="/assets/ds/ds-frame.png"
          alt="DS frame"
          fill
          priority
          className="object-contain pointer-events-none select-none z-20"
        /> 
        
      </div>
    </div>
  );
}
