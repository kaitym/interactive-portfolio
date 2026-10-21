"use client";

import { useEffect, useRef, useState } from "react";
import { BottomScreen, TopScreen } from "../screens";
import { sfx } from "../sound";
import { TouchButton } from "../apps/ContentShell";

const SYMBOLS = ["★", "♥", "♦", "♣", "♠", "●"];
const COLORS = ["#dc2626", "#db2777", "#7c3aed", "#2563eb", "#059669", "#d97706"];

type Card = { id: number; symbol: number; matched: boolean };

function shuffledDeck(): Card[] {
  const cards: Card[] = SYMBOLS.flatMap((_, s) => [
    { id: s * 2, symbol: s, matched: false },
    { id: s * 2 + 1, symbol: s, matched: false },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryMatch({
  framePress,
  onExit,
  goHome,
}: {
  framePress: { id: string; seq: number } | null;
  onExit: () => void;
  goHome: () => void;
}) {
  const [deck, setDeck] = useState<Card[]>(shuffledDeck);
  const [faceUp, setFaceUp] = useState<number[]>([]); // card ids currently showing
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const lockRef = useRef(false);

  const pairs = deck.filter((c) => c.matched).length / 2;
  const won = pairs === SYMBOLS.length;

  useEffect(() => {
    if (won) {
      sfx.win();
      setBest((b) => (b === null || moves < b ? moves : b));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  useEffect(() => {
    if (!framePress) return;
    if (framePress.id === "B") onExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePress]);

  const restart = () => {
    setDeck(shuffledDeck());
    setFaceUp([]);
    setMoves(0);
    lockRef.current = false;
  };

  const flip = (card: Card) => {
    if (lockRef.current || card.matched || faceUp.includes(card.id) || won) return;
    sfx.flip();
    const next = [...faceUp, card.id];
    setFaceUp(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next.map((id) => deck.find((c) => c.id === id)!);
    if (a.symbol === b.symbol) {
      setDeck((d) => d.map((c) => (c.symbol === a.symbol ? { ...c, matched: true } : c)));
      setFaceUp([]);
      sfx.match();
    } else {
      lockRef.current = true;
      setTimeout(() => {
        setFaceUp([]);
        lockRef.current = false;
      }, 650);
    }
  };

  return (
    <>
      <TopScreen className="bg-[#fdfdf6]">
        <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center text-black">
          <div className="font-Rodin text-[0.58rem] uppercase text-violet-700">Memory Match</div>
          {won ? (
            <>
              <div className="text-[0.72rem] font-bold">You matched them all!</div>
              <div className="text-[0.62rem]">
                {moves} moves{best !== null ? ` · Best: ${best}` : ""}
              </div>
              <div className="text-[0.58rem] text-black/55">Tap New game below to play again.</div>
            </>
          ) : (
            <>
              <div className="text-[0.68rem] font-bold">
                Pairs: {pairs} / {SYMBOLS.length}
              </div>
              <div className="text-[0.62rem]">Moves: {moves}</div>
              <div className="text-[0.58rem] text-black/55">
                Flip two cards on the touch screen and find the matching symbols.
              </div>
            </>
          )}
        </div>
      </TopScreen>
      <BottomScreen className="bg-gradient-to-b from-violet-50 to-violet-100">
        <div className="flex h-full flex-col gap-1.5 p-2 text-black">
          <div className="grid min-h-0 flex-1 grid-cols-4 gap-1.5">
            {deck.map((card) => {
              const showing = card.matched || faceUp.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  aria-label={showing ? SYMBOLS[card.symbol] : "Face-down card"}
                  onClick={() => flip(card)}
                  className={`flex items-center justify-center rounded-lg border-2 text-lg transition ${
                    card.matched
                      ? "border-emerald-600/50 bg-emerald-100"
                      : showing
                        ? "border-black/50 bg-white"
                        : "border-violet-900/40 bg-gradient-to-b from-violet-400 to-violet-600 hover:from-violet-300 hover:to-violet-500"
                  }`}
                  style={showing ? { color: COLORS[card.symbol] } : undefined}
                >
                  {showing ? SYMBOLS[card.symbol] : <span className="text-[0.6rem] font-bold text-white/85">?</span>}
                </button>
              );
            })}
          </div>
          <div className="flex gap-1.5">
            <TouchButton onClick={restart} className="flex-1">
              New game
            </TouchButton>
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
