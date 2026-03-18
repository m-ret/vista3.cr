# Vista3.cr — Design Exploration

## Quick Start
```bash
bun install
bun run dev      # dev server (Next.js + Turbopack)
bun run build    # production build
```

## Stack
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Three.js (@react-three/fiber) + GSAP + Lenis

## Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Design exploration index
│   ├── globals.css         # Tailwind theme + custom styles
│   ├── 1/page.tsx          # Direction 01 — Cinematic Luxury / Editorial
│   ├── 2/page.tsx          # Direction 02 — Clean Brutalist / Modern
│   └── 3/page.tsx          # Direction 03 — Experimental / Interactive Nature
├── components/
│   ├── shared/Icons.tsx    # SVG icon library
│   └── direction-3/ArchScene.tsx  # WebGL terrain + particles (Three.js)
├── data/projects.ts        # Projects, services, testimonials, contact
├── hooks/
│   ├── useLenis.ts         # Smooth scrolling
│   ├── useScrollReveal.ts  # GSAP scroll-triggered animations
│   └── useMousePosition.ts # Cursor tracking
└── lib/utils.ts            # cn() utility
```

## Routes
- `/`  — Design exploration index (gallery of 3 directions)
- `/1` — Cinematic Luxury (dark, editorial, parallax, scroll-driven)
- `/2` — Clean Brutalist (bright, Swiss grid, strong typography)
- `/3` — Experimental Nature (WebGL hero, cursor interactions, organic)

## Conventions
- Use Bun for all package management and scripts
- All text in English (international client base)
- Brand: "Vista3" with gold accent on the "3"
- Fonts: Playfair Display (display), Inter (body), Space Grotesk (heading), Syne (accent), Space Mono (mono)
