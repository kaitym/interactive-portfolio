"use client";

import type { AppProps } from "../screens";
import { ABOUT_PARAGRAPHS, PROFILE, SKILLS } from "../data";
import ContentShell from "./ContentShell";

export default function AboutApp(props: AppProps) {
  return (
    <ContentShell title="About Me" {...props}>
      <div className="text-black">
        <div className="font-Rodin text-[0.6rem] uppercase">{PROFILE.name}</div>
        <div className="mt-0.5 text-[0.6rem] font-semibold text-sky-800">{PROFILE.headline}</div>
        <div className="text-[0.58rem] text-black/60">{PROFILE.location}</div>
        {ABOUT_PARAGRAPHS.map((p, i) => (
          <p key={i} className="mt-2 text-[0.62rem] leading-relaxed">
            {p}
          </p>
        ))}
        <div className="mt-3 border-t border-black/15 pt-2">
          <div className="font-Rodin text-[0.5rem] uppercase text-black/70">Toolbox</div>
          {SKILLS.map((s) => (
            <p key={s.group} className="mt-1 text-[0.6rem] leading-snug">
              <span className="font-bold">{s.group}:</span> {s.items}
            </p>
          ))}
        </div>
      </div>
    </ContentShell>
  );
}
