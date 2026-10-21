"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BottomScreen, TopScreen, type AppProps } from "../screens";
import { playAsset } from "../sound";

/** A chunky touch-screen button used across apps and games. */
export function TouchButton({
  children,
  onClick,
  className = "",
  ariaLabel,
  sound = "click",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  /** Which UI sound belongs to this button (one sound per action). */
  sound?: "click" | "open" | "home" | null;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (sound) playAsset(sound);
        onClick();
      }}
      className={`rounded-xl border-2 border-black/25 bg-gradient-to-b from-white to-neutral-200 px-2 py-1.5 text-[0.6rem] font-bold uppercase tracking-wide text-black shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.2)] transition active:translate-y-px hover:border-black/50 ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Shared scaffold for the read-only apps (About, Resume, Projects, Classes,
 * Gallery): the top screen shows a titled, scrollable page; the bottom touch
 * screen carries HOME + scroll buttons. The physical D-pad UP/DOWN and the
 * B button work too (via framePress).
 */
export default function ContentShell({
  title,
  framePress,
  goHome,
  children,
  bottom,
}: AppProps & { title: string; children: ReactNode; bottom?: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dy: number) => {
    scrollRef.current?.scrollBy({ top: dy, behavior: "smooth" });
  };

  useEffect(() => {
    if (!framePress) return;
    if (framePress.id === "UP") scrollBy(-70);
    else if (framePress.id === "DOWN") scrollBy(70);
    else if (framePress.id === "B") goHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress]);

  return (
    <>
      <TopScreen className="bg-[#fdfdf6]">
        <div className="flex h-full flex-col text-black">
          <div className="shrink-0 border-b-2 border-black/70 bg-gradient-to-b from-sky-100 to-sky-200 px-2 py-1">
            <span className="font-Rodin text-[0.55rem] uppercase tracking-wide">{title}</span>
          </div>
          <div ref={scrollRef} className="ds-scroll min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
            {children}
          </div>
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-sky-50 to-sky-100">
        {bottom ?? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-black">
            <div className="font-Rodin text-[0.5rem] uppercase text-black/50">
              Use ▲ ▼ or the D-pad to scroll
            </div>
            <div className="flex items-center gap-2">
              <TouchButton onClick={goHome} sound={null} className="px-4 py-2.5 text-[0.7rem]">
                ⌂ Home
              </TouchButton>
              <TouchButton onClick={() => scrollBy(-70)} ariaLabel="Scroll up" className="px-3 py-2.5">
                ▲
              </TouchButton>
              <TouchButton onClick={() => scrollBy(70)} ariaLabel="Scroll down" className="px-3 py-2.5">
                ▼
              </TouchButton>
            </div>
            <div className="text-[0.55rem] text-black/40">B button also goes home</div>
          </div>
        )}
      </BottomScreen>
    </>
  );
}
