# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # type-check + Vite build
npm run lint         # ESLint (zero warnings allowed)
npm test             # run tests in watch mode
npm test -- --run    # run tests once (used in CI)
npm run test:coverage
```

## Architecture

Single-page portfolio built with React 18 + TypeScript + Vite + TailwindCSS, deployed on Vercel.

**Page layout** (`src/App.tsx`): `<Cursor>` + `<Header>` + sections (Hero → About → Projects → Contact) + `<Footer>`. All sections are anchor-linked (`#projects`, `#contact`).

**Data** (`src/data/portfolio.ts`): All content (projects, skills) lives here as typed exports. Edit this file to update portfolio content.

**Custom hooks:**
- `useReveal` — attaches an `IntersectionObserver` to a ref; adds `.visible` CSS class when element enters the viewport (used for scroll-in animations).
- `useScramble(target, delay)` — animates text by scrambling random chars before revealing the final string frame-by-frame.

**Testing** (`src/test/`): Vitest + `@testing-library/react`, environment is jsdom. `src/test/setup.ts` mocks `IntersectionObserver` and `matchMedia` globally — any new hook that uses these browser APIs is already covered. Tests are co-located in `src/test/` mirroring component names.
