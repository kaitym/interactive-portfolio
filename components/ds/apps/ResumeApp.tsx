"use client";

import type { AppProps } from "../screens";
import { PROFILE, RESUME } from "../data";
import ContentShell from "./ContentShell";

export default function ResumeApp(props: AppProps) {
  return (
    <ContentShell title="Resume" {...props}>
      <div className="text-black">
        <div className="font-Rodin text-[0.6rem] uppercase">{PROFILE.name}</div>
        <div className="text-[0.58rem] text-black/60">{PROFILE.headline}</div>
        <div className="text-[0.58rem] text-black/60">{PROFILE.targetRoles}</div>

        {RESUME.map((section) => (
          <div key={section.title} className="mt-3">
            <div className="border-b-2 border-black/70 pb-0.5 font-Rodin text-[0.52rem] uppercase">
              {section.title}
            </div>
            {section.entries.map((e) => (
              <div key={e.heading} className="mt-1.5">
                <div className="text-[0.62rem] font-bold leading-tight">{e.heading}</div>
                {e.sub && <div className="text-[0.56rem] italic text-black/60">{e.sub}</div>}
                {e.bullets && (
                  <ul className="mt-0.5 list-disc pl-3.5">
                    {e.bullets.map((b, i) => (
                      <li key={i} className="text-[0.6rem] leading-snug">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
        <p className="mt-3 text-[0.55rem] text-black/45">
          Full resume: github.com/kaitym/KaityMurphy_Resume
        </p>
      </div>
    </ContentShell>
  );
}
