import type { CSSProperties, ReactNode } from "react";

export type AppId = "about" | "resume" | "projects" | "classes" | "gallery" | "games";

/** A physical frame-button press, forwarded from the DS shell to the open app. */
export type FramePress = { id: string; seq: number };

export type AppProps = {
  framePress: FramePress | null;
  goHome: () => void;
};

// Screen areas as % of the full 800x772 DS frame image (unchanged from the
// original calibration — the frame cutouts line up with these numbers).
export const TOP_SCREEN_STYLE: CSSProperties = {
  left: "27.75%",
  top: "13.34%",
  width: "44.38%",
  height: "29.02%",
  zIndex: 5,
};

export const BOTTOM_SCREEN_STYLE: CSSProperties = {
  left: "29.13%",
  top: "54.27%",
  width: "41.38%",
  height: "29.53%",
  zIndex: 5,
};

const CHROME =
  "absolute overflow-hidden border border-black/20 rounded-[3px] shadow-[inset_0_0_12px_rgba(0,0,0,0.18)]";

export function TopScreen({
  children,
  className = "bg-white",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${CHROME} ${className}`} style={TOP_SCREEN_STYLE}>
      {children}
    </div>
  );
}

export function BottomScreen({
  children,
  className = "bg-white",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${CHROME} ${className}`} style={BOTTOM_SCREEN_STYLE}>
      {children}
    </div>
  );
}
