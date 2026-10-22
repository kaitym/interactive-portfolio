"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BottomScreen, TopScreen } from "../screens";
import { sfx } from "../sound";
import { TouchButton } from "../apps/ContentShell";

const COLS = 17;
const ROWS = 10;

type Pt = { x: number; y: number };
type Status = "ready" | "playing" | "paused" | "over";

const eq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
const START: Pt[] = [
  { x: 8, y: 5 },
  { x: 7, y: 5 },
  { x: 6, y: 5 },
];

function randomFood(snake: Pt[]): Pt {
  for (;;) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => eq(s, p))) return p;
  }
}

export default function Snake({
  framePress,
  onExit,
  goHome,
}: {
  framePress: { id: string; seq: number } | null;
  onExit: () => void;
  goHome: () => void;
}) {
  const [snake, setSnake] = useState<Pt[]>(START);
  const [food, setFood] = useState<Pt>({ x: 12, y: 5 });
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const pendingDirRef = useRef<Pt>({ x: 1, y: 0 });
  const statusRef = useRef<Status>("ready");
  statusRef.current = status;

  const speed = Math.max(75, 150 - Math.floor(score / 50) * 12);

  const reset = useCallback(() => {
    setSnake(START);
    setFood(randomFood(START));
    setScore(0);
    dirRef.current = { x: 1, y: 0 };
    pendingDirRef.current = { x: 1, y: 0 };
    setStatus("playing");
  }, []);

  const togglePause = useCallback(() => {
    if (statusRef.current === "playing") setStatus("paused");
    else if (statusRef.current === "paused") setStatus("playing");
    else reset();
  }, [reset]);

  const steer = useCallback((d: Pt) => {
    const cur = dirRef.current;
    if (d.x === -cur.x && d.y === -cur.y) return; // no 180° turns
    pendingDirRef.current = d;
  }, []);

  // Game loop
  useEffect(() => {
    if (status !== "playing") return;
    const iv = setInterval(() => {
      dirRef.current = pendingDirRef.current;
      const head = snake[0];
      const next = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };
      if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS || snake.some((s) => eq(s, next))) {
        setStatus("over");
        setBest((b) => Math.max(b, score));
        sfx.lose();
        return;
      }
      const ate = eq(next, food);
      const body = ate ? snake : snake.slice(0, -1);
      const newSnake = [next, ...body];
      setSnake(newSnake);
      if (ate) {
        setScore((s) => s + 10);
        setFood(randomFood(newSnake));
        sfx.eat();
      }
    }, speed);
    return () => clearInterval(iv);
  }, [status, snake, food, score, speed]);

  // Physical frame buttons
  useEffect(() => {
    if (!framePress) return;
    switch (framePress.id) {
      case "UP":
        if (statusRef.current === "playing") steer({ x: 0, y: -1 });
        break;
      case "DOWN":
        if (statusRef.current === "playing") steer({ x: 0, y: 1 });
        break;
      case "LEFT":
        if (statusRef.current === "playing") steer({ x: -1, y: 0 });
        break;
      case "RIGHT":
        if (statusRef.current === "playing") steer({ x: 1, y: 0 });
        break;
      case "A":
      case "X":
        togglePause();
        break;
      case "B":
        onExit();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress]);

  const padBtn =
    "flex items-center justify-center rounded-lg border-2 border-black/30 bg-gradient-to-b from-white to-neutral-200 text-sm text-black shadow active:translate-y-px";

  return (
    <>
      <TopScreen className="bg-[#0d2818]">
        <div className="flex h-full flex-col text-white">
          <div className="flex shrink-0 items-center justify-between px-2 py-1 text-[0.58rem] font-bold">
            <span className="font-Rodin text-[0.5rem] uppercase text-emerald-300">Snake</span>
            <span>
              Score {score} · Best {best}
            </span>
          </div>
          <div className="relative mx-auto w-full max-w-[228px] flex-1 px-1 pb-1">
            <div
              className="grid h-full w-full gap-px rounded-sm bg-emerald-950/60 p-px"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
              {Array.from({ length: COLS * ROWS }).map((_, i) => {
                const x = i % COLS;
                const y = Math.floor(i / COLS);
                const isHead = eq(snake[0], { x, y });
                const isBody = !isHead && snake.some((s) => eq(s, { x, y }));
                const isFood = eq(food, { x, y });
                return (
                  <div
                    key={i}
                    className={
                      isHead
                        ? "rounded-[2px] bg-lime-300"
                        : isBody
                          ? "rounded-[2px] bg-lime-500"
                          : isFood
                            ? "rounded-full bg-red-400"
                            : "bg-emerald-900/40"
                    }
                  />
                );
              })}
            </div>
            {status !== "playing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-center">
                <div className="font-Rodin text-[0.55rem] uppercase leading-relaxed">
                  {status === "ready" && "Ready?"}
                  {status === "paused" && "Paused"}
                  {status === "over" && "Game Over"}
                </div>
                <div className="mt-0.5 text-[0.6rem]">
                  {status === "over" ? `Final score: ${score}` : "Press Start or tap ▶"}
                </div>
              </div>
            )}
          </div>
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-emerald-50 to-emerald-100">
        <div className="flex h-full items-center gap-2 p-2 text-black">
          {/* Touch D-pad */}
          <div className="grid shrink-0 grid-cols-3 grid-rows-3 gap-0.5" style={{ width: 86, height: 86 }}>
            <span />
            <button type="button" aria-label="Up" className={padBtn} onClick={() => status === "playing" && steer({ x: 0, y: -1 })}>
              ▲
            </button>
            <span />
            <button type="button" aria-label="Left" className={padBtn} onClick={() => status === "playing" && steer({ x: -1, y: 0 })}>
              ◀
            </button>
            <button
              type="button"
              aria-label={status === "playing" ? "Pause" : "Start"}
              className={`${padBtn} text-[0.55rem] font-bold`}
              onClick={togglePause}
            >
              {status === "playing" ? "❚❚" : "▶"}
            </button>
            <button type="button" aria-label="Right" className={padBtn} onClick={() => status === "playing" && steer({ x: 1, y: 0 })}>
              ▶
            </button>
            <span />
            <button type="button" aria-label="Down" className={padBtn} onClick={() => status === "playing" && steer({ x: 0, y: 1 })}>
              ▼
            </button>
            <span />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-stretch justify-center gap-1.5">
            <div className="text-center text-[0.58rem] leading-snug text-black/60">
              Steer with the touch pad, the DS D-pad, or arrow keys.
            </div>
            <TouchButton onClick={reset}>{status === "over" || status === "paused" ? "Restart" : "New game"}</TouchButton>
            <div className="flex gap-1.5">
              <TouchButton onClick={onExit} className="flex-1">
                ◀ Games
              </TouchButton>
              <TouchButton onClick={goHome} sound={null} className="flex-1">
                ⌂ Home
              </TouchButton>
            </div>
          </div>
        </div>
      </BottomScreen>
    </>
  );
}
