"use client";

import { useState } from "react";

type AppId = "projects" | "classes" | "gallery" | "games" | "about";

const APPS: { id: AppId; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "classes", label: "Classes" },
  { id: "gallery", label: "Gallery" },
  { id: "games", label: "Mini-Games" },
  { id: "about", label: "About" },
];

export default function DS() {
  const [active, setActive] = useState<AppId>("projects");

  return (
    <div className="w-full max-w-[520px]">
      {/* DS body */}
      <div className="rounded-[28px] bg-zinc-900/90 border border-white/10 shadow-2xl p-5">
        {/* Top screen */}
        <div className="rounded-[18px] bg-black/70 border border-white/10 p-4 h-[240px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold">{labelFor(active)}</div>
            <div className="text-white/60 mt-2">
              Placeholder content — next we’ll make this a real “app”.
            </div>
          </div>
        </div>

        {/* Hinge */}
        <div className="h-3" />

        {/* Bottom screen (touch UI) */}
        <div className="rounded-[18px] bg-black/60 border border-white/10 p-4">
          <div className="grid grid-cols-2 gap-3">
            {APPS.map((a) => (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                className={[
                  "rounded-xl border px-4 py-3 text-left transition",
                  a.id === active
                    ? "bg-white/15 border-white/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="text-sm uppercase tracking-wide text-white/60">
                  App
                </div>
                <div className="text-lg font-medium">{a.label}</div>
              </button>
            ))}
          </div>

          {/* Fake hardware row */}
          <div className="mt-4 flex items-center justify-between text-white/40 text-xs">
            <div>D-Pad</div>
            <div>Start • Select</div>
            <div>A • B</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function labelFor(id: AppId) {
  return APPS.find((a) => a.id === id)?.label ?? id;
}
