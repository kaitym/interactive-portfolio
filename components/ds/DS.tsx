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

// Apps available on the DS home screen. `glyph` is the big pictogram shown
// on the home tile + top-screen banner (in the spirit of the original 3DS
// HOME Menu tiles — one bold, colourful icon per tile, no heavy text).
const APPS: {
  id: AppId;
  label: string;
  accent: string;
  glyph: string;
  iconBg: string;
  desc: string;
}[] = [
  {
    id: "about",
    label: "About Me",
    accent: "#0d9488",
    glyph: "Mii",
    iconBg: "#ccfbf1",
    desc: "Hi! I'm Kaity — CS senior who likes building things people actually use.",
  },
  {
    id: "resume",
    label: "Resume",
    accent: "#d97706",
    glyph: "📝",
    iconBg: "#fef3c7",
    desc: "Education, experience and skills — the full rundown on one page.",
  },
  {
    id: "projects",
    label: "Projects",
    accent: "#ea580c",
    glyph: "🛍️",
    iconBg: "#ffedd5",
    desc: "Things I've built — from Pacman AI to this very DS.",
  },
  {
    id: "classes",
    label: "Classes",
    accent: "#7c3aed",
    glyph: "📚",
    iconBg: "#ede9fe",
    desc: "What I'm studying in my final term at the University of Oregon.",
  },
  {
    id: "gallery",
    label: "Gallery",
    accent: "#f97316",
    glyph: "📷",
    iconBg: "#ffedd5",
    desc: "Postcards from Stockholm, Eugene, and home in Orange County.",
  },
  {
    id: "games",
    label: "Mini-Games",
    accent: "#dc2626",
    glyph: "🎮",
    iconBg: "#ffe4e6",
    desc: "Snake, Memory Match and Reaction — three tiny games, all playable!",
  },
];

// Tiny toolbar glyphs along the top of the touch screen, copying the
// original 3DS HOME Menu strip. Decorative-but-clickable: each one just
// moves the home focus somewhere sensible (and clicks). They never open
// anything on their own, so they can't land in a broken state.
// `focus` = index into APPS to focus, or -1 to reset focus to 0 (home).
const TOOLBAR: { glyph: string; label: string; focus: number; muted?: boolean }[] = [
  { glyph: "🏠", label: "Home", focus: -1 },
  { glyph: "✏️", label: "Notes", focus: 1 },
  { glyph: "☺️", label: "About", focus: 0 },
  { glyph: "💬", label: "Projects", focus: 2 },
  { glyph: "🌐", label: "Gallery", focus: 4 },
  { glyph: "👥", label: "Classes", focus: 3 },
  { glyph: "▦", label: "All apps", focus: 5, muted: true },
  { glyph: "♪", label: "Sounds", focus: 5, muted: true },
];

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

/** Big centred pictogram for an app (used on tiles and the top banner). */
function AppGlyph({ app, large = false }: { app: (typeof APPS)[number]; large?: boolean }) {
  if (app.id === "about") {
    // 'Mii'-style teal lettering, like the tile in the reference screenshot.
    return (
      <span
        aria-hidden
        className={`font-black italic leading-none tracking-tight text-teal-600 drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] ${
          large ? "text-[2rem]" : "text-[1.05rem]"
        }`}
      >
        Mii
      </span>
    );
  }
  return (
    <span aria-hidden className={`leading-none ${large ? "text-[2.1rem]" : "text-[1.35rem]"}`}>
      {app.glyph}
    </span>
  );
}

/** The signature 3DS focus indicator: four teal L-brackets hugging a tile. */
function FocusBrackets() {
  const base = "focus-bracket pointer-events-none absolute h-[10px] w-[10px] border-teal-400";
  return (
    <span aria-hidden className="pointer-events-none absolute -inset-[3px] z-10">
      <span className={`${base} left-0 top-0 rounded-tl-[6px] border-l-[3px] border-t-[3px]`} />
      <span className={`${base} right-0 top-0 rounded-tr-[6px] border-r-[3px] border-t-[3px]`} />
      <span className={`${base} bottom-0 left-0 rounded-bl-[6px] border-b-[3px] border-l-[3px]`} />
      <span className={`${base} bottom-0 right-0 rounded-br-[6px] border-b-[3px] border-r-[3px]`} />
    </span>
  );
}

export default function DS() {
  const [powered, setPowered] = useState(true);
  const [active, setActive] = useState<AppId | null>(null);
  const [focus, setFocus] = useState(0);
  const [framePress, setFramePress] = useState<FramePress | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [clock, setClock] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const seqRef = useRef(0);
  const activeRef = useRef<AppId | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const focusedApp = APPS[focus] ?? APPS[0];

  // Boot sound attempt on first load (browsers may block it until a gesture;
  // the POWER button always plays it for real).
  useEffect(() => {
    playAsset("startup");
  }, []);

  // Home-screen clock + date
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      setDateLabel(
        now.toLocaleDateString([], { weekday: "short", month: "numeric", day: "numeric" }),
      );
    };
    update();
    const iv = setInterval(update, 15000);
    return () => clearInterval(iv);
  }, []);

  const goHome = useCallback(() => {
    if (activeRef.current !== null) playAsset("home");
    // Clear any pending frame press so the next screen to mount doesn't
    // replay it (a stale "B" used to instantly close the next app opened).
    setFramePress(null);
    setActive(null);
  }, []);

  const openApp = useCallback((id: AppId) => {
    playAsset("open");
    setFramePress(null);
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

  const handleFrameButton = useCallback(
    (id: string) => {
      unlockAudio();

      if (id === "POWER") {
        setFramePress(null);
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

      // Home screen navigation on the single 3-column grid: LEFT/RIGHT step
      // one tile, UP/DOWN step a whole row (3), clamped to the 6 real apps
      // (the 3 blank tiles are never focusable). A opens; X/Y cycle focus.
      if (id === "LEFT") setFocus((f) => Math.max(0, f - 1));
      else if (id === "RIGHT") setFocus((f) => Math.min(APPS.length - 1, f + 1));
      else if (id === "UP") setFocus((f) => Math.max(0, f - 3));
      else if (id === "DOWN") setFocus((f) => Math.min(APPS.length - 1, f + 3));
      else if (id === "A") openApp(APPS[focus].id);
      else if (id === "X") setFocus((f) => (f + 1) % APPS.length);
      else if (id === "Y") setFocus((f) => (f + APPS.length - 1) % APPS.length);
    },
    [powered, active, focus, goHome, openApp, spawnCoin],
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
            {/* Top screen: 3DS-style status bar + banner for the focused app */}
            <TopScreen className="bg-gradient-to-b from-sky-100 via-white to-sky-50">
              <div className="flex h-full flex-col text-black">
                {/* Status bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-black/10 bg-white/70 px-2 py-[3px] text-[0.5rem] font-semibold text-black/60">
                  <span data-testid="home-date">{dateLabel || " "}</span>
                  <span className="font-Rodin text-[0.48rem] uppercase tracking-wide text-sky-900">
                    Kaity Murphy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-label="Wi-Fi connected" title="Wi-Fi">
                      📶
                    </span>
                    <span data-testid="home-clock">{clock || " "}</span>
                    <span aria-label="Battery" title="Battery">
                      🔋
                    </span>
                  </span>
                </div>
                {/* Focused-app banner — changes as focus moves */}
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-1 text-center">
                  <div
                    data-testid="home-banner"
                    className="flex w-full flex-col items-center"
                  >
                    <div
                      className="banner-icon flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"
                      style={{ background: focusedApp.iconBg }}
                    >
                      <AppGlyph app={focusedApp} large />
                    </div>
                    <div
                      data-testid="home-banner-name"
                      className="mt-1 font-Rodin text-[0.62rem] uppercase leading-relaxed"
                    >
                      {focusedApp.label}
                    </div>
                    <p className="mt-0.5 max-w-[94%] text-[0.6rem] leading-snug text-black/70">
                      {focusedApp.desc}
                    </p>
                  </div>
                  <div className="mt-1 text-[0.52rem] text-black/45">
                    CS @ University of Oregon · Tap a tile or use D-pad + A
                  </div>
                </div>
              </div>
            </TopScreen>

            {/* Bottom screen: original 3DS HOME Menu vibe */}
            <BottomScreen className="ds-home-bg">
              <div className="flex h-full flex-col text-black">
                {/* Toolbar strip (like the screenshot's top icon row) */}
                <div className="flex shrink-0 items-center justify-between gap-[3px] border-b border-black/10 bg-white/50 px-1.5 py-[3px]">
                  {TOOLBAR.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      aria-label={`Toolbar: ${t.label}`}
                      title={t.label}
                      onClick={() => {
                        playAsset("click");
                        setFocus(t.focus < 0 ? 0 : t.focus);
                      }}
                      className={`flex h-[18px] w-[22px] items-center justify-center rounded-[5px] border border-black/10 bg-gradient-to-b from-white to-neutral-100 text-[0.55rem] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition hover:border-black/30 ${
                        t.muted ? "opacity-50 saturate-50" : ""
                      }`}
                    >
                      <span aria-hidden>{t.glyph}</span>
                    </button>
                  ))}
                </div>

                {/* 3x3 grid: 6 real apps + 3 blank tiles, like the original */}
                <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-[5px] p-[6px]">
                  {APPS.map((a, idx) => {
                    const focused = idx === focus;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        data-testid={`home-tile-${a.id}`}
                        aria-label={a.label}
                        onMouseEnter={() => setFocus(idx)}
                        onFocus={() => setFocus(idx)}
                        onClick={() => {
                          setFocus(idx);
                          openApp(a.id);
                        }}
                        className="relative flex min-h-0 flex-col items-center justify-center gap-[1px] rounded-[10px] border border-black/10 bg-gradient-to-b from-white via-white to-neutral-200 shadow-[0_2px_4px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] transition hover:brightness-[1.03]"
                      >
                        {focused && <FocusBrackets />}
                        <span
                          className="flex h-[26px] w-[30px] items-center justify-center rounded-[7px]"
                          style={{ background: a.iconBg }}
                        >
                          <AppGlyph app={a} />
                        </span>
                        <span className="max-w-full truncate px-0.5 text-[0.44rem] font-bold uppercase leading-tight tracking-tight text-black/60">
                          {a.label}
                        </span>
                      </button>
                    );
                  })}
                  {/* Blank tiles — part of the original look, never focusable */}
                  {[0, 1, 2].map((i) => (
                    <div
                      key={`blank-${i}`}
                      aria-hidden
                      data-testid="home-blank-tile"
                      className="min-h-0 rounded-[10px] border border-black/[0.07] bg-gradient-to-b from-white via-neutral-50 to-neutral-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    />
                  ))}
                </div>

                {/* Focused-app name pill */}
                <div className="flex shrink-0 items-center justify-center pb-[5px]">
                  <span
                    data-testid="home-focus-pill"
                    className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-2.5 py-[2px] text-[0.52rem] font-bold uppercase tracking-wide text-black/75 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: focusedApp.accent }}
                    />
                    {focusedApp.label}
                  </span>
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
