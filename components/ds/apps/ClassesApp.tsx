"use client";

import type { AppProps } from "../screens";
import { CURRENT_COURSES, PAST_COURSES, type Course } from "../data";
import ContentShell from "./ContentShell";

function CourseCard({ c }: { c: Course }) {
  return (
    <div className="rounded-lg border border-black/20 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-Rodin text-[0.52rem] uppercase">{c.code}</span>
        <span className="text-right text-[0.56rem] font-semibold text-sky-800">{c.topic}</span>
      </div>
      <p className="mt-0.5 text-[0.6rem] leading-snug">{c.note}</p>
    </div>
  );
}

export default function ClassesApp(props: AppProps) {
  return (
    <ContentShell title="Classes" {...props}>
      <div className="flex flex-col gap-2 text-black">
        <div className="font-Rodin text-[0.5rem] uppercase text-black/60">Fall 2026 · Final term</div>
        {CURRENT_COURSES.map((c) => (
          <CourseCard key={c.code} c={c} />
        ))}
        <div className="mt-1 font-Rodin text-[0.5rem] uppercase text-black/60">Earlier favorites</div>
        {PAST_COURSES.map((c) => (
          <CourseCard key={c.code} c={c} />
        ))}
      </div>
    </ContentShell>
  );
}
