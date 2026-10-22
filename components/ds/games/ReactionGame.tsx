"use client";

import { useEffect, useRef, useState } from "react";
import { BottomScreen, TopScreen } from "../screens";
import { sfx } from "../sound";
import { TouchButton } from "../apps/ContentShell";

type Phase = "idle" | "waiting" | "go" | "tooSoon" | "result";

export default function ReactionGame({
  framePress,
  onExit,
  goHome,
}: {
  framePress: { id: string; seq: number } | null;
  onExit: () => void;
  goHome: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goAtRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const tap = () => {
    const p = phaseRef.current;
    if (p === "idle" || p === "result" || p === "tooSoon") {
      // start a round
      clearTimer();
      setResult(null);
      setPhase("waiting");
      timerRef.current = setTimeout(() => {
        goAtRef.current = performance.now();
        setPhase("go");
        sfx.go();
      }, 1200 + Math.random() * 2300);
    } else if (p === "waiting") {
      clearTimer();
      setPhase("tooSoon");
      sfx.buzz();
    } else if (p === "go") {
      const ms = Math.round(performance.now() - goAtRef.current);
      setResult(ms);
      setBest((b) => (b === null || ms < b ? ms : b));
      setPhase("result");
      sfx.win();
    }
  };

  useEffect(() => {
    if (!framePress) return;
    if (framePress.id === "A") tap();
    else if (framePress.id === "B") onExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress]);

  useEffect(() => clearTimer, []);

  const topBg =
    phase === "go"
      ? "bg-emerald-500"
      : phase === "waiting"
        ? "bg-red-500"
        : phase === "tooSoon"
          ? "bg-neutral-700"
          : "bg-[#fdfdf6]";

  return (
    <>
      <TopScreen className={topBg}>
        <div
          className={`flex h-full flex-col items-center justify-center gap-1 p-3 text-center ${
            phase === "idle" || phase === "result" ? "text-black" : "text-white"
          }`}
        >
          <div className="font-Rodin text-[0.58rem] uppercase">Reaction</div>
          {phase === "idle" && (
            <p className="max-w-[92%] text-[0.62rem] leading-snug">
              Tap the big pad below, wait for green… then tap again as fast as you can!
            </p>
          )}
          {phase === "waiting" && <div className="font-Rodin text-[0.7rem] uppercase">Wait for it…</div>}
          {phase === "go" && <div className="font-Rodin text-[0.8rem] uppercase">Tap!</div>}
          {phase === "tooSoon" && (
            <>
              <div className="font-Rodin text-[0.65rem] uppercase">Too soon!</div>
              <p className="text-[0.62rem]">Tap the pad to try again.</p>
            </>
          )}
          {phase === "result" && (
            <>
              <div className="text-[0.85rem] font-bold">{result} ms</div>
              <p className="text-[0.62rem]">
                {best !== null ? `Best: ${best} ms · ` : ""}Tap the pad to go again.
              </p>
            </>
          )}
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="flex h-full flex-col gap-1.5 p-2 text-black">
          <button
            type="button"
            onClick={tap}
            aria-label="Reaction pad"
            className={`min-h-0 flex-1 rounded-xl border-2 text-[0.7rem] font-bold uppercase tracking-wide shadow-inner transition ${
              phase === "go"
                ? "border-emerald-700 bg-emerald-400 text-white"
                : phase === "waiting"
                  ? "border-red-800 bg-red-400 text-white"
                  : "border-black/30 bg-gradient-to-b from-white to-amber-200 hover:border-black/50"
            }`}
          >
            {phase === "waiting" ? "…" : phase === "go" ? "Tap!" : "Tap pad"}
          </button>
          <div className="flex gap-1.5">
            <TouchButton onClick={onExit} className="flex-1">
              ◀ Games
            </TouchButton>
            <TouchButton onClick={goHome} sound={null} className="flex-1">
              ⌂ Home
            </TouchButton>
          </div>
        </div>
      </BottomScreen>
    </>
  );
}
