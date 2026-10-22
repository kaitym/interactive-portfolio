"use client";

import { useEffect, useState } from "react";
import { BottomScreen, TopScreen, type AppProps } from "../screens";
import { PLACES } from "../data";
import { playAsset } from "../sound";
import { TouchButton } from "./ContentShell";

/**
 * Gallery: postcard views of the places on Kaity's map. The top screen shows
 * the selected postcard big; the touch screen picks which one. (Swap the
 * gradient tiles in data.ts for real photos anytime.)
 */
export default function GalleryApp({ framePress, goHome }: AppProps) {
  const [index, setIndex] = useState(0);
  const place = PLACES[index];

  const select = (i: number) => {
    setIndex(((i % PLACES.length) + PLACES.length) % PLACES.length);
  };

  useEffect(() => {
    if (!framePress) return;
    if (framePress.id === "RIGHT" || framePress.id === "DOWN") select(index + 1);
    else if (framePress.id === "LEFT" || framePress.id === "UP") select(index - 1);
    else if (framePress.id === "B") goHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress]);

  return (
    <>
      <TopScreen>
        <div className="relative h-full w-full text-white" style={{ background: place.gradient }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
            <div className="text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]">{place.glyph}</div>
            <div className="mt-1 font-Rodin text-[0.6rem] uppercase leading-relaxed drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]">
              {place.name}
            </div>
            <p className="mt-1 max-w-[90%] text-[0.6rem] leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {place.caption}
            </p>
          </div>
          <div className="absolute bottom-1 right-2 text-[0.55rem] font-bold text-white/85">
            {index + 1} / {PLACES.length}
          </div>
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="flex h-full flex-col gap-2 p-2.5 text-black">
          <div className="grid flex-1 grid-cols-2 gap-2">
            {PLACES.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  playAsset("open");
                  select(i);
                }}
                className={`relative overflow-hidden rounded-lg border-2 text-left text-white transition ${
                  i === index ? "border-black" : "border-black/20 hover:border-black/50"
                }`}
                style={{ background: p.gradient }}
              >
                <span className="absolute inset-x-1 bottom-0.5 truncate text-[0.52rem] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  {p.name}
                </span>
                <span className="absolute right-1 top-0.5 text-[0.6rem] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  {p.glyph}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <TouchButton onClick={goHome} sound={null}>
              ⌂ Home
            </TouchButton>
            <div className="flex gap-1.5">
              <TouchButton onClick={() => select(index - 1)} ariaLabel="Previous postcard">
                ◀
              </TouchButton>
              <TouchButton onClick={() => select(index + 1)} ariaLabel="Next postcard">
                ▶
              </TouchButton>
            </div>
          </div>
        </div>
      </BottomScreen>
    </>
  );
}
