"use client";

import { useEffect, useRef, useState } from "react";
import { BottomScreen, TopScreen, type AppProps } from "../screens";
import { playAsset } from "../sound";
import { TouchButton } from "./ContentShell";
import Snake from "../games/Snake";
import MemoryMatch from "../games/MemoryMatch";
import ReactionGame from "../games/ReactionGame";

type GameId = "snake" | "memory" | "reaction";

const GAMES: { id: GameId; label: string; blurb: string; accent: string }[] = [
  { id: "snake", label: "Snake", blurb: "Eat, grow, don't bite yourself.", accent: "#16a34a" },
  { id: "memory", label: "Memory Match", blurb: "Flip cards and find all 6 pairs.", accent: "#7c3aed" },
  { id: "reaction", label: "Reaction", blurb: "Wait for green, then tap — fast!", accent: "#d97706" },
];

export default function GamesApp({ framePress, goHome }: AppProps) {
  const [game, setGame] = useState<GameId | null>(null);
  const toMenu = () => setGame(null);
  // The press that opens a game (e.g. "A" on the menu) must not be replayed
  // into the game itself — Snake would start instantly, Reaction would
  // start its timer, and a stale "B" could bounce straight back out.
  // Remember the seq at selection time and only forward newer presses.
  const openSeqRef = useRef(0);
  const selectGame = (id: GameId) => {
    openSeqRef.current = framePress?.seq ?? 0;
    setGame(id);
  };
  const gameFramePress =
    framePress && framePress.seq > openSeqRef.current ? framePress : null;

  useEffect(() => {
    if (!framePress || game) return;
    if (framePress.id === "B") goHome();
    if (framePress.id === "A") {
      playAsset("open");
      selectGame("snake");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress, game]);

  if (game === "snake") return <Snake framePress={gameFramePress} onExit={toMenu} goHome={goHome} />;
  if (game === "memory") return <MemoryMatch framePress={gameFramePress} onExit={toMenu} goHome={goHome} />;
  if (game === "reaction") return <ReactionGame framePress={gameFramePress} onExit={toMenu} goHome={goHome} />;

  return (
    <>
      <TopScreen className="bg-[#fdfdf6]">
        <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center text-black">
          <div className="font-Rodin text-[0.62rem] uppercase">Mini-Games</div>
          <p className="max-w-[92%] text-[0.62rem] leading-snug">
            Three tiny games live in this DS. Pick one on the touch screen — they all work with the
            physical D-pad and buttons too.
          </p>
          <p className="text-[0.56rem] text-black/50">High scores reset when you leave the page.</p>
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-sky-50 to-sky-100">
        <div className="flex h-full flex-col gap-2 p-2.5 text-black">
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            {GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  playAsset("open");
                  selectGame(g.id);
                }}
                className="flex flex-1 items-center gap-2 overflow-hidden rounded-xl border-2 border-black/20 bg-gradient-to-b from-white to-neutral-100 text-left shadow transition hover:border-black/50"
              >
                <span className="h-full w-2 shrink-0" style={{ background: g.accent }} />
                <span className="min-w-0 py-1">
                  <span className="block truncate text-[0.68rem] font-bold">{g.label}</span>
                  <span className="block truncate text-[0.56rem] text-black/55">{g.blurb}</span>
                </span>
              </button>
            ))}
          </div>
          <TouchButton onClick={goHome} sound={null}>
            ⌂ Home
          </TouchButton>
        </div>
      </BottomScreen>
    </>
  );
}
