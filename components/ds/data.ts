// Portfolio content for Kaity Murphy.
// Everything here is factual (from Kaity + her resume repo); edit freely —
// the About, Resume, Projects, Classes and Gallery apps all read from this
// one file, so updates only need to happen in one place.

export const PROFILE = {
  name: "Kaity Murphy",
  headline: "B.S. Computer Science · University of Oregon · Dec 2026",
  location: "From Orange County, CA · currently in Eugene, OR",
  targetRoles: "Product engineering · Growth engineering · AI product engineering",
};

export const ABOUT_PARAGRAPHS: string[] = [
  "Hi! I'm Kaity Murphy, a senior studying Computer Science at the University of Oregon, graduating in December 2026.",
  "Last summer I was a Software Engineering Intern at Challengermode in Stockholm, Sweden, building AI-driven operations systems — LLM features, prompt engineering, and MCP integrations on top of backend APIs — that automated esports tournament workflows and cut down manual staffing for large tournaments.",
  "Before that, I spent two years as a part-time Research Intern at Saratech, where I got my start in tech (and picked up HTML/CSS organizing the company website).",
  "I'm aiming at product engineering, growth engineering, and AI product engineering roles — I like work where the engineering touches the user. This whole portfolio is a Nintendo DS because building things should be fun.",
];

export const SKILLS: { group: string; items: string }[] = [
  { group: "Languages", items: "Python · JavaScript · TypeScript · C · C++ · HTML/CSS" },
  { group: "AI", items: "OpenAI API · Prompt engineering · LLM integrations · MCP" },
  { group: "Web", items: "Full-stack development · Backend APIs · Flask · MongoDB · React / Next.js" },
];

export type ResumeSection = {
  title: string;
  entries: { heading: string; sub?: string; bullets?: string[] }[];
};

export const RESUME: ResumeSection[] = [
  {
    title: "Education",
    entries: [
      {
        heading: "University of Oregon — Eugene, OR",
        sub: "B.S. Computer Science · Sep 2022 – Dec 2026",
        bullets: [
          "Relevant coursework: Artificial Intelligence (CS 471), Computation Theory (CS 420), Machine Learning & Programming Languages (CS 425)",
        ],
      },
    ],
  },
  {
    title: "Experience",
    entries: [
      {
        heading: "Challengermode — Stockholm, Sweden",
        sub: "Software Engineering Intern · Jul – Sep 2025",
        bullets: [
          "Built AI-driven operations systems using LLMs, prompt engineering, and Model Context Protocol (MCP) integrations",
          "Developed backend APIs connecting AI features to production systems and user data",
          "Automated esports tournament workflows, reducing manual staffing needs for large tournaments",
        ],
      },
      {
        heading: "Saratech — Mission Viejo, CA",
        sub: "Research Intern (part-time) · Mar 2023 – Feb 2025",
        bullets: [
          "Researched companies in the aerospace and defense industry to identify leads and market opportunities",
          "Built targeted email campaigns and templates in Salesforce Account Engagement",
          "Used HTML/CSS to help organize and update the company website",
        ],
      },
    ],
  },
  {
    title: "Projects",
    entries: [
      {
        heading: "DS Portfolio (this site!)",
        sub: "Next.js · React · TypeScript · Tailwind CSS",
        bullets: [
          "A Nintendo DS–inspired interactive portfolio with a working home screen, apps, sounds, and playable mini-games",
        ],
      },
      {
        heading: "Pacman AI — CS 471",
        sub: "Python",
        bullets: [
          "Implemented search algorithms (BFS, DFS, UCS, A*) and admissible heuristics for corners and food-grid problems",
        ],
      },
      {
        heading: "L-Systems Plant Simulator — CS 211",
        sub: "Python · OOP · Turtle graphics",
        bullets: [
          "Simulated plant growth with stochastic L-systems; built LSystem, Stack, and State classes to render branching structures",
        ],
      },
      {
        heading: "Command-Line Math — CS 212",
        sub: "C · Linux",
        bullets: [
          "C program that parses and validates command-line math operations by hand — no atoi/atof/strcmp allowed",
        ],
      },
    ],
  },
  {
    title: "Skills",
    entries: SKILLS.map((s) => ({ heading: s.group, sub: s.items })),
  },
  {
    title: "Activities",
    entries: [
      {
        heading: "Delta Gamma",
        sub: "Member since Mar 2023 · Scholarship & Foundation committees",
      },
    ],
  },
];

export type Project = { name: string; stack: string; blurb: string };

export const PROJECTS: Project[] = [
  {
    name: "DS Portfolio",
    stack: "Next.js · TypeScript · Tailwind",
    blurb:
      "This site! A Nintendo DS you can click through — home screen apps, real sounds, and playable mini-games. You're holding it.",
  },
  {
    name: "Pacman AI",
    stack: "Python · CS 471",
    blurb:
      "Search agents for the Berkeley Pacman framework: BFS/DFS/UCS/A* plus hand-built heuristics that keep node expansions low on the corners and food-grid problems.",
  },
  {
    name: "L-Systems Plant Simulator",
    stack: "Python · OOP · Turtle",
    blurb:
      "Grows fractal plants from string-rewriting rules. Stochastic rules make every run a little different.",
  },
  {
    name: "Command-Line Math",
    stack: "C · Linux",
    blurb:
      "A calculator in C that parses its own arguments — validation, conversion, and math all done without the usual library shortcuts.",
  },
];

export type Course = { code: string; topic: string; note: string };

export const CURRENT_COURSES: Course[] = [
  {
    code: "CS 471",
    topic: "Artificial Intelligence",
    note: "Search, CSPs, games, and MDPs. The Pacman projects live here.",
  },
  {
    code: "CS 420",
    topic: "Computation Theory",
    note: "Automata, context-free grammars, and pushdown automata (Sipser).",
  },
  {
    code: "CS 425",
    topic: "Machine Learning & Programming Languages",
    note: "ML plus how programming languages work — including writing a type checker.",
  },
];

export const PAST_COURSES: Course[] = [
  { code: "CS 212", topic: "C & Systems", note: "C language, Linux, data structures and algorithms." },
  { code: "CS 211", topic: "Python & OOP", note: "Object-oriented programming, GUIs, and simulation." },
];

export type Place = { name: string; caption: string; gradient: string; glyph: string };

export const PLACES: Place[] = [
  {
    name: "Stockholm, Sweden",
    caption: "Summer 2025 — software engineering internship at Challengermode.",
    gradient: "linear-gradient(160deg,#7dd3fc 0%,#2563eb 55%,#1e3a8a 100%)",
    glyph: "★",
  },
  {
    name: "Eugene, Oregon",
    caption: "Home of the Ducks — University of Oregon, class of Dec 2026.",
    gradient: "linear-gradient(160deg,#86efac 0%,#15803d 60%,#14532d 100%)",
    glyph: "♥",
  },
  {
    name: "San Clemente, CA",
    caption: "Hometown in Orange County. Where I'm from and where family is.",
    gradient: "linear-gradient(160deg,#fcd9a8 0%,#fb923c 55%,#c2410c 100%)",
    glyph: "●",
  },
  {
    name: "San Diego, CA",
    caption: "Top of the list for life after graduation.",
    gradient: "linear-gradient(160deg,#fbcfe8 0%,#f472b6 55%,#9d174d 100%)",
    glyph: "♦",
  },
];
