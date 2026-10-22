"use client";

import type { AppProps } from "../screens";
import { PROJECTS } from "../data";
import ContentShell from "./ContentShell";

export default function ProjectsApp(props: AppProps) {
  return (
    <ContentShell title="Projects" {...props}>
      <div className="flex flex-col gap-2 text-black">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="rounded-lg border border-black/20 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          >
            <div className="text-[0.64rem] font-bold leading-tight">{p.name}</div>
            <div className="text-[0.55rem] font-semibold uppercase tracking-wide text-sky-800">
              {p.stack}
            </div>
            <p className="mt-0.5 text-[0.6rem] leading-snug">{p.blurb}</p>
          </div>
        ))}
        <p className="text-[0.55rem] text-black/45">More code: github.com/kaitym</p>
      </div>
    </ContentShell>
  );
}
