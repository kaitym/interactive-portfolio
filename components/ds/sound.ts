// Central sound manager for the DS portfolio.
//
// Two layers:
//  1. Asset sounds — the real DS/Wii mp3 clips already in /public/assets/ds,
//     played through lazily-created HTMLAudioElements. Every UI interaction
//     maps to exactly one asset so sounds stay "aligned" with the action:
//       startup -> power on / boot        click  -> page change / UI confirm
//       plastic -> physical frame buttons open   -> opening an app
//       coin    -> START button coin      home   -> returning to home screen
//  2. Synth sounds — tiny WebAudio blips for in-game events (no assets needed).
//
// playAsset restarts the clip from 0 and debounces per-sound so a handler
// that fires twice in the same tick can't double-play.

export type AssetSound = "startup" | "click" | "plastic" | "open" | "coin" | "home";

const ASSETS: Record<AssetSound, { src: string; volume: number }> = {
  startup: { src: "/assets/ds/nintendo-ds-startup.mp3", volume: 0.6 },
  click: { src: "/assets/ds/wii-click.mp3", volume: 0.5 },
  plastic: { src: "/assets/ds/pastic-click.mp3", volume: 0.45 },
  open: { src: "/assets/ds/pictochat-join.mp3", volume: 0.55 },
  coin: { src: "/assets/ds/coin-sound.mp3", volume: 0.5 },
  home: { src: "/assets/ds/nintendo-switch-home-sound.mp3", volume: 0.5 },
};

const cache = new Map<AssetSound, HTMLAudioElement>();
const lastPlayedAt = new Map<AssetSound, number>();
const DEBOUNCE_MS = 45;

export function playAsset(name: AssetSound) {
  if (typeof window === "undefined") return;
  const now = performance.now();
  if (now - (lastPlayedAt.get(name) ?? 0) < DEBOUNCE_MS) return;
  lastPlayedAt.set(name, now);

  let el = cache.get(name);
  if (!el) {
    el = new Audio(ASSETS[name].src);
    el.preload = "auto";
    cache.set(name, el);
  }
  el.volume = ASSETS[name].volume;
  try {
    el.currentTime = 0;
  } catch {
    // not loaded yet — play() below still works once metadata arrives
  }
  void el.play().catch(() => {
    // Autoplay policies block sound before the first user gesture; ignore.
  });
}

// ---------- WebAudio synth (game SFX) ----------

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

/** Call from any user gesture so later synth sounds aren't blocked. */
export function unlockAudio() {
  audioCtx();
}

type ToneOpts = {
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
  slideTo?: number;
};

export function tone(freq: number, opts: ToneOpts = {}) {
  const ac = audioCtx();
  if (!ac) return;
  const { duration = 0.12, type = "square", volume = 0.12, delay = 0, slideTo } = opts;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + duration);
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  flip: () => tone(660, { duration: 0.06, type: "triangle", volume: 0.1 }),
  eat: () => {
    tone(520, { duration: 0.07, type: "square", volume: 0.12 });
    tone(780, { duration: 0.09, type: "square", volume: 0.12, delay: 0.06 });
  },
  match: () => {
    tone(784, { duration: 0.09, type: "triangle", volume: 0.14 });
    tone(1175, { duration: 0.14, type: "triangle", volume: 0.14, delay: 0.08 });
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(f, { duration: 0.14, type: "triangle", volume: 0.14, delay: i * 0.1 }),
    );
  },
  lose: () => tone(320, { duration: 0.35, type: "sawtooth", volume: 0.1, slideTo: 90 }),
  go: () => tone(1047, { duration: 0.16, type: "square", volume: 0.14 }),
  buzz: () => tone(140, { duration: 0.22, type: "sawtooth", volume: 0.12 }),
  tick: () => tone(440, { duration: 0.05, type: "sine", volume: 0.08 }),
};
