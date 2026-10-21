"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { playAsset, unlockAudio } from "./sound";
import {
  BottomScreen,
  TopScreen,
  type AppId,
  type FramePress,
} from "./screens";
import AboutApp from "./apps/AboutApp";
import ResumeApp from "./apps/ResumeApp";
import ProjectsApp from "./apps/ProjectsApp";
import ClassesApp from "./apps/ClassesApp";
import GalleryApp from "./apps/GalleryApp";
import GamesApp from "./apps/GamesApp";

// Apps available on the DS home screen
const APPS: { id: AppId; label: string; accent: string }[] = [
  { id: "about", label: "About Me", accent: "#0284c7" },
  { id: "resume", label: "Resume", accent: "#b45309" },
  { id: "projects", label: "Projects", accent: "#16a34a" },
  { id: "classes", label: "Classes", accent: "#7c3aed" },
  { id: "gallery", label: "Gallery", accent: "#db2777" },
  { id: "games", label: "Mini-Games", accent: "#dc2626" },
];

const PAGE_SIZE = 3;

// Button hit boxes (calibrated to the frame image — do not change lightly)
const BUTTONS = [
  // D-pad
  { id: "UP", left: "15.20%", top: "56.91%", width: "4.50%", height: "4.75%" },
  { id: "DOWN", left: "15.20%", top: "64.77%", width: "4.50%", height: "4.75%" },
  { id: "LEFT", left: "11.50%", top: "61.29%", width: "4.75%", height: "4.50%" },
  { id: "RIGHT", left: "19.50%", top: "61.29%", width: "4.75%", height: "4.50%" },

  // Face buttons (diamond)
  { id: "X", left: "79.55%", top: "55.81%", width: "4.75%", height: "4.75%" },
  { id: "A", left: "84.25%", top: "60.80%", width: "4.75%", height: "4.75%" },
  { id: "Y", left: "74.75%", top: "60.80%", width: "4.75%", height: "4.75%" },
  { id: "B", left: "79.55%", top: "65.50%", width: "4.75%", height: "4.75%" },

  // Start / Select (small buttons)
  { id: "START", left: "74.12%", top: "75.59%", width: "4.12%", height: "4.12%" },
  { id: "SELECT", left: "74.12%", top: "81.66%", width: "4.12%", height: "4.12%" },

  // Power button
  { id: "POWER", left: "17.85%", top: "77.75%", width: "5.80%", height: "5.80%" },
] as const;

const PLASTIC_BUTTONS = new Set(["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y"]);

type Coin = { id: string; delay: number; xOffset: string; peak: string; end: string };

export default function DS() {
  const totalPages = Math.ceil(APPS.length / PAGE_SIZE);
  const [powered, setPowered] = useState(true);
  const [active, setActive] = useState<AppId | null>(null);
  const [focus, setFocus] = useState(0);
  const [framePress, setFramePress] = useState<FramePress | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [clock, setClock] = useState("");
  const seqRef = useRef(0);
  const activeRef = useRef<AppId | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const page = Math.floor(focus / PAGE_SIZE);
  const appsOnPage = APPS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // Boot sound attempt on first load (browsers may block it until a gesture;
  // the POWER button always plays it for real).
  useEffect(() => {
    playAsset("startup");
  }, []);

  // Home-screen clock
  useEffect(() => {
    const update = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    update();
    const iv = setInterval(update, 15000);
    return () => clearInterval(iv);
  }, []);

  const goHome = useCallback(() => {
    if (activeRef.current !== null) playAsset("home");
    setActive(null);
  }, []);

  const openApp = useCallback((id: AppId) => {
    playAsset("open");
    setActive(id);
  }, []);

  const spawnCoin = useCallback(() => {
    playAsset("coin");
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const coin: Coin = {
      id,
      delay: Math.random() * 0.2,
      xOffset: `${direction * (40 + Math.random() * 70)}px`,
      peak: `${-80 - Math.random() * 90}px`,
      end: `${60 + Math.random() * 20}vh`,
    };
    setCoins((prev) => [...prev, coin]);
    setTimeout(() => setCoins((prev) => prev.filter((c) => c.id !== id)), 3200);
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      const clamped = Math.max(0, Math.min(totalPages - 1, p));
      if (clamped === page) return;
      playAsset("click");
      setFocus(clamped * PAGE_SIZE);
    },
    [page, totalPages],
  );

  const handleFrameButton = useCallback(
    (id: string) => {
      unlockAudio();

      if (id === "POWER") {
        if (powered) {
          setPowered(false);
          setActive(null);
          setCoins([]);
        } else {
          setPowered(true);
          setActive(null);
          setFocus(0);
          playAsset("startup");
        }
        return;
      }
      if (!powered) return;

      if (PLASTIC_BUTTONS.has(id)) playAsset("plastic");

      if (id === "START") {
        spawnCoin();
        return;
      }
      if (id === "SELECT") {
        goHome();
        return;
      }

      // An app is open: forward the press; the app decides what it means.
      if (active) {
        seqRef.current += 1;
        setFramePress({ id, seq: seqRef.current });
        return;
      }

      // Home screen navigation: D-pad moves the focus, A opens, X/Y flip pages.
      if (id === "LEFT") setFocus((f) => Math.max(0, f - 1));
      else if (id === "RIGHT") setFocus((f) => Math.min(APPS.length - 1, f + 1));
      else if (id === "UP") setFocus((f) => Math.max(0, f - PAGE_SIZE));
      else if (id === "DOWN") setFocus((f) => Math.min(APPS.length - 1, f + PAGE_SIZE));
      else if (id === "A") openApp(APPS[focus].id);
      else if (id === "X") goToPage(page + 1);
      else if (id === "Y") goToPage(page - 1);
    },
    [powered, active, focus, page, goHome, openApp, spawnCoin, goToPage],
  );

  // Keyboard controls (handy on a desktop): arrows/WASD = D-pad, X = A,
  // Z = B, Enter = START, Shift = SELECT, P = POWER.
  useEffect(() => {
    const KEYMAP: Record<string, string> = {
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
      w: "UP",
      s: "DOWN",
      a: "LEFT",
      d: "RIGHT",
      x: "A",
      z: "B",
      Enter: "START",
      Shift: "SELECT",
      p: "POWER",
    };
    const onKey = (e: KeyboardEvent) => {
      const id = KEYMAP[e.key];
      if (!id) return;
      if (e.key.startsWith("Arrow")) e.preventDefault();
      if (e.repeat && !e.key.startsWith("Arrow")) return;
      handleFrameButton(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleFrameButton]);

  const appProps = { framePress, goHome };

  return (
    <div className="w-full max-w-[560px]">
      <div
        className="relative w-full"
        style={{ aspectRatio: "800 / 772" }}
        onPointerDown={() => unlockAudio()}
      >
        {/* Coin Animation Layer */}
        {powered && (
          <div className="pointer-events-none absolute inset-0 z-30">
            {coins.map((coin) => {
              const style = {
                left: "50%",
                top: "16%",
                animationDelay: `${coin.delay}s`,
                "--coin-x": coin.xOffset,
                "--coin-peak": coin.peak,
                "--coin-end": coin.end,
              } as CSSProperties;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={coin.id}
                  src="/assets/ds/coin.png"
                  alt=""
                  className="coin-flight absolute"
                  style={style}
                />
              );
            })}
          </div>
        )}

        {/* Screens */}
        {!powered ? (
          <>
            <TopScreen className="bg-neutral-950" />
            <BottomScreen className="bg-neutral-950" />
          </>
        ) : active === "about" ? (
          <AboutApp {...appProps} />
        ) : active === "resume" ? (
          <ResumeApp {...appProps} />
        ) : active === "projects" ? (
          <ProjectsApp {...appProps} />
        ) : active === "classes" ? (
          <ClassesApp {...appProps} />
        ) : active === "gallery" ? (
          <GalleryApp {...appProps} />
        ) : active === "games" ? (
          <GamesApp {...appProps} />
        ) : (
          <>
            {/* Top screen: home / welcome */}
            <TopScreen className="bg-gradient-to-b from-sky-100 via-white to-sky-50">
              <div className="flex h-full flex-col items-center justify-center p-3 text-center text-black">
                <div className="font-Rodin text-[0.7rem] uppercase leading-relaxed">
                  Kaity Murphy
                </div>
                <div className="mt-0.5 text-[0.62rem] font-semibold text-sky-800">
                  DS Portfolio · CS @ University of Oregon
                </div>
                <div className="mt-2 font-Rodin text-[0.55rem] text-black/60">{clock || " "}</div>
                <p className="mt-2 max-w-[92%] text-[0.62rem] leading-snug text-black/70">
                  Welcome in! Pick an app on the touch screen below — the top screen is where
                  everything shows up.
                </p>
                <p className="mt-1.5 text-[0.55rem] text-black/45">
                  D-pad + A work too · START makes it rain coins
                </p>
              </div>
            </TopScreen>

            {/* Bottom screen: home menu */}
            <BottomScreen className="bg-gradient-to-b from-sky-50 to-sky-100">
              <div className="flex h-full flex-col gap-2 p-3 text-black">
                <div className="flex min-h-0 flex-1 items-center">
                  <div className="flex w-full items-center gap-2.5">
                    {page > 0 ? (
                      <button
                        type="button"
                        aria-label="Previous page"
                        onClick={() => goToPage(page - 1)}
                        className="shrink-0 rounded-full border border-black/20 bg-black/5 px-2.5 py-3 text-black transition hover:bg-black/10"
                      >
                        ◀
                      </button>
                    ) : (
                      <span className="w-[30px] shrink-0" />
                    )}
                    <div className="grid flex-1 grid-cols-3 gap-2.5">
                      {appsOnPage.map((a) => {
                        const idx = APPS.indexOf(a);
                        const focused = idx === focus;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setFocus(idx);
                              openApp(a.id);
                            }}
                            className={`flex aspect-square flex-col overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-white to-neutral-100 text-[0.58rem] font-bold uppercase leading-tight tracking-tight shadow-[inset_0_1px_4px_rgba(0,0,0,0.12)] transition ${
                              focused
                                ? "border-black ring-2 ring-sky-500"
                                : "border-black/20 text-black/60 hover:border-black/50"
                            }`}
                          >
                            <span className="h-1.5 w-full shrink-0" style={{ background: a.accent }} />
                            <span className="flex flex-1 items-center justify-center px-0.5 text-center">
                              {a.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {page < totalPages - 1 ? (
                      <button
                        type="button"
                        aria-label="Next page"
                        onClick={() => goToPage(page + 1)}
                        className="shrink-0 rounded-full border border-black/20 bg-black/5 px-2.5 py-3 text-black transition hover:bg-black/10"
                      >
                        ▶
                      </button>
                    ) : (
                      <span className="w-[30px] shrink-0" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={`page-dot-${idx}`}
                      type="button"
                      aria-label={`Go to page ${idx + 1}`}
                      onClick={() => goToPage(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        idx === page ? "bg-black" : "bg-black/20 hover:bg-black/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </BottomScreen>
          </>
        )}

        {/* BUTTON HITBOXES */}
        {BUTTONS.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label={b.id}
            onClick={() => handleFrameButton(b.id)}
            className="absolute appearance-none border-0 bg-transparent outline-none"
            style={{ left: b.left, top: b.top, width: b.width, height: b.height, zIndex: 30 }}
          />
        ))}

        {/* DS frame overlay */}
        <Image
          src="/assets/ds/ds-frame.png"
          alt="DS frame"
          fill
          priority
          className="pointer-events-none z-20 select-none object-contain"
        />
      </div>
    </div>
  );
}
