# Interactive DS Portfolio

Hi, I'm Kaity! I'm a computer science senior at the University of Oregon (graduating December 2026), and this is my portfolio — built as a Nintendo DS.

Personal project to showcase my personality and love for computer science, past projects, classes, mini games, and just to have fun. I grew up playing my DS/3DS constantly, so when I needed a portfolio site I figured why not make the whole thing a handheld?

## What's in it

The DS actually works. The bottom screen is the touch screen, the top screen is where everything shows up, and the home screen is styled after the 3DS HOME Menu (that was a whole project on its own — the little toolbar, the chunky white tiles, the green corner brackets around whatever you've got selected).

There are 6 apps:

- **About Me** — who I am, what I've done, what I'm looking for next
- **Resume** — the actual resume stuff
- **Projects** — things I've built, including this site
- **Classes** — what I'm taking / have taken at UO
- **Gallery** — postcards from the places that matter to me (Stockholm, Eugene, home in Orange County, San Diego)
- **Mini-Games** — Snake, Memory Match, and a Reaction timer. All playable, all keep score while you're there

Buttons that all do something: POWER turns the DS off and on for real, START makes it rain coins, SELECT/B takes you home, and in Snake the D-pad actually steers. On a computer you can also just use your keyboard — arrows to move, X for A, Z for B, Enter for START, Shift for SELECT, P for power.

## Built with

Next.js, React, TypeScript, and Tailwind CSS. No game engine or DS library or anything — the screens, buttons, and hitboxes are all just positioned over the DS frame image and wired up by hand, which took some trial and error to get lined up right.

All of my actual content (bio, resume sections, projects, classes, gallery captions) lives in one file, `components/ds/data.ts`, so when I need to update something I only have to change it in one place and every app picks it up.

Sounds are real handheld sounds (startup chime, clicks, the coin sound) managed through one little sound system so the right sound plays for the right action and nothing double-fires. The mini-games use tiny synthesized beeps instead, since I didn't have sound files for those.

## Run it locally

From the root directory:

```
npm install
npm run dev
```

Then open http://localhost:3000.

## A note on how I built this

This is my project — my idea, my content, my design calls, and a lot of my own debugging at 1am. I did use Muse (Meta's AI assistant) as a coding helper along the way, kind of like a very patient pair programmer: it helped me prototype a couple of the bigger features, ran through every app and button in a browser to help me catch bugs (it found one really annoying one where the last button you pressed would leak into the next app you opened), and helped draft some of the repetitive parts. Everything in here I've read, tested, and decided on — if something's broken, that's on me, and if you find a bug please let me know because it probably means my Snake high score is in danger too.

— Kaity Murphy
