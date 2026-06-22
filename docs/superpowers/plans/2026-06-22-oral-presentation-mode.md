# Oral Presentation Mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the `/oral` page into a projector-friendly deck: visual-first slides on the audience screen, speaker notes in a synced second presenter window, in-app architecture/DB diagrams, more real code, and a printable notes page.

**Architecture:** One data source (`SLIDES`) is split out of the monolithic `Oral.tsx` into `src/pages/oral/`. A shared `SlideView` renders the projected content (never the `detail` text). Three routes consume it: `/oral` (public/projected), `/oral/presenter` (slide + notes + timer + next), `/oral/notes` (printable). The two live windows stay in sync through a `useOralSync` hook backed by `BroadcastChannel` (localStorage fallback).

**Tech Stack:** React 18, TypeScript, Vite (base `/portfolio/`), react-router-dom v6 (`basename="/portfolio"`), TailwindCSS, Vitest + @testing-library/react (jsdom).

## Global Constraints

- TypeScript: never use `any`; `interface` for object shapes; export types with their owner.
- Style: single quotes in TS/TSX, double quotes in JSX attributes, no semicolons (ASI), 2-space indent, max 100 cols, trailing commas in multiline.
- React: one component per file, file name matches component, props interface directly above component, destructure props in signature.
- Tailwind utilities only — no custom CSS class names (existing `.slide-enter` and `body[data-oral]` in `src/index.css` may be reused).
- Assets referenced as runtime strings MUST be prefixed: `` `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` ``.
- Tests live in `src/test/` mirroring the unit name; prefer `getByRole`/`getByText` semantic queries; `IntersectionObserver` and `matchMedia` are globally mocked in `src/test/setup.ts`.
- Router basename is `/portfolio`; in-app links use `/oral...` paths, but `window.open` of a full URL uses `` `${import.meta.env.BASE_URL}oral` ``.

---

## File Structure

- Create `src/pages/oral/slides.ts` — `SlidePoint`, `Slide`, `Step` interfaces, `SLIDES`, `SECTIONS`, `generateSteps`, `STEPS`. (Moved out of `Oral.tsx`.) Adds `diagram?` field.
- Create `src/pages/oral/SlideView.tsx` — shared renderer for one `Step` (overview or zoom). Never renders `detail`.
- Create `src/pages/oral/diagrams/ArchitectureDiagram.tsx` — MVVM/Clean 3-layer diagram (CSS/SVG).
- Create `src/pages/oral/diagrams/DbSchemaDiagram.tsx` — 5 Room entities + relations (CSS/SVG).
- Create `src/pages/oral/useOralSync.ts` — cross-window step sync hook.
- Create `src/pages/oral/PresenterView.tsx` — presenter layout (`/oral/presenter`).
- Create `src/pages/oral/NotesPage.tsx` — printable notes (`/oral/notes`).
- Modify `src/pages/Oral.tsx` — becomes the public/projected view; imports data from `./oral/slides`, renders `SlideView`, uses `useOralSync`.
- Modify `src/App.tsx:29-32` — add `/oral/presenter` and `/oral/notes` routes.
- Modify `src/test/Oral.test.tsx:5` — import `generateSteps`/`STEPS` from `../pages/oral/slides`.
- Create tests: `SlideView.test.tsx`, `useOralSync.test.tsx`, `OralDiagrams.test.tsx`, `PresenterView.test.tsx`, `NotesPage.test.tsx`.

**Refinement vs spec:** `SlideView` has no `mode` prop — it never renders `detail` (always projected content). The `detail` text appears only inside `PresenterView`'s notes panel and `NotesPage`. This is simpler than the spec's `mode` prop and keeps the audience window free of notes by construction.

---

## Task 1: Extract slide data and step model into `slides.ts`

**Files:**
- Create: `src/pages/oral/slides.ts`
- Modify: `src/pages/Oral.tsx` (remove moved code, import from new module, re-export)
- Modify: `src/test/Oral.test.tsx:5`

**Interfaces:**
- Produces: `interface SlidePoint { text: string; detail?: string; image?: string; video?: string; code?: string; diagram?: 'architecture' | 'db' }`, `interface Slide { id: string; section: string; title: string; subtitle?: string; points: SlidePoint[] }`, `type Step = { kind: 'overview'; slideIndex: number } | { kind: 'zoom'; slideIndex: number; pointIndex: number }`, `const SLIDES: Slide[]`, `const SECTIONS: string[]`, `function generateSteps(slides: Slide[]): Step[]`, `const STEPS: Step[]`.

- [ ] **Step 1: Create `src/pages/oral/slides.ts` by moving code verbatim**

Cut from `src/pages/Oral.tsx` the following and paste into the new file, in this order: the `SlidePoint` interface (lines 4-10), the `Slide` interface (lines 12-18), the entire `const SLIDES: Slide[] = [ ... ]` array (lines 20-903), `const SECTIONS` (line 905), `type Step` (lines 907-909), `export function generateSteps` (lines 911-920), `export const STEPS` (line 922). Add `export` to `SLIDES` and `SECTIONS`. Add the `diagram?` field to `SlidePoint`:

```ts
export interface SlidePoint {
  text: string
  detail?: string
  image?: string
  video?: string
  code?: string
  diagram?: 'architecture' | 'db'
}

export interface Slide {
  id: string
  section: string
  title: string
  subtitle?: string
  points: SlidePoint[]
}

export const SLIDES: Slide[] = [
  /* ...the full array moved verbatim from Oral.tsx... */
]

export const SECTIONS = [...new Set(SLIDES.map(s => s.section))]

export type Step =
  | { kind: 'overview'; slideIndex: number }
  | { kind: 'zoom'; slideIndex: number; pointIndex: number }

export function generateSteps(slides: Slide[]): Step[] {
  return slides.flatMap((slide, slideIndex) => [
    { kind: 'overview' as const, slideIndex },
    ...slide.points.map((_, pointIndex) => ({
      kind: 'zoom' as const,
      slideIndex,
      pointIndex,
    })),
  ])
}

export const STEPS = generateSteps(SLIDES)
```

- [ ] **Step 2: Update `Oral.tsx` to import from the new module**

At the top of `src/pages/Oral.tsx`, after the existing React/router imports, add:

```ts
import { SLIDES, SECTIONS, STEPS, type Slide, type Step } from './oral/slides'
```

Delete the now-moved declarations from `Oral.tsx` (the two interfaces, `SLIDES`, `SECTIONS`, `Step`, `generateSteps`, `STEPS`). Leave `ZoomSlide` and the `Oral` component in place for now (Task 2 handles them). `ZoomSlide`'s `ZoomSlideProps` still references `Slide` — now imported.

- [ ] **Step 3: Update the test import**

In `src/test/Oral.test.tsx`, change line 5 from:

```ts
import Oral, { generateSteps, STEPS } from '../pages/Oral'
```

to:

```ts
import Oral from '../pages/Oral'
import { generateSteps, STEPS } from '../pages/oral/slides'
```

- [ ] **Step 4: Run the full suite to verify nothing broke**

Run: `npm test -- --run`
Expected: all suites PASS (same count as before, including `generateSteps` and `Oral` tests).

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no output (success).

- [ ] **Step 6: Commit**

```bash
git add src/pages/oral/slides.ts src/pages/Oral.tsx src/test/Oral.test.tsx
git commit -m "refactor(oral): extract slide data and step model into slides.ts"
```

---

## Task 2: Shared `SlideView` component (no `detail` on screen)

**Files:**
- Create: `src/pages/oral/SlideView.tsx`
- Modify: `src/pages/Oral.tsx` (replace inline overview/`ZoomSlide` rendering with `<SlideView step={step} />`; delete `ZoomSlide`)
- Test: `src/test/SlideView.test.tsx`

**Interfaces:**
- Consumes: `SLIDES`, `Step`, `Slide` from `./slides`.
- Produces: `interface SlideViewProps { step: Step }`, default export `SlideView`. Renders overview (section + title + subtitle + bullet list of `point.text`) or zoom (image/video/code/diagram + `point.text`). Never renders `point.detail`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/SlideView.test.tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SlideView from '../pages/oral/SlideView'
import { SLIDES, STEPS } from '../pages/oral/slides'

describe('SlideView', () => {
  it('renders the slide title on an overview step', () => {
    const stepIndex = STEPS.findIndex(s => s.kind === 'overview')
    render(<SlideView step={STEPS[stepIndex]} />)
    expect(screen.getByText(SLIDES[0].title)).toBeInTheDocument()
  })

  it('never renders a point detail (notes stay off the projected screen)', () => {
    const zoom = STEPS.find(
      s => s.kind === 'zoom' && !!SLIDES[s.slideIndex].points[s.pointIndex].detail,
    )!
    const point = SLIDES[zoom.slideIndex].points[(zoom as { pointIndex: number }).pointIndex]
    render(<SlideView step={zoom} />)
    expect(screen.getByText(point.text)).toBeInTheDocument()
    expect(screen.queryByText(point.detail as string)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/SlideView.test.tsx`
Expected: FAIL — cannot resolve `../pages/oral/SlideView`.

- [ ] **Step 3: Create `SlideView.tsx`**

Move the rendering logic out of `Oral.tsx`. The component renders an overview or a zoom step. Diagram support is wired now but the diagram components arrive in Task 4 — import them eagerly (they will exist after Task 4; if executing strictly in order, leave the `diagram` branch returning `null` and revisit in Task 4). Implementation:

```tsx
// src/pages/oral/SlideView.tsx
import { SLIDES, type Slide, type Step } from './slides'
import ArchitectureDiagram from './diagrams/ArchitectureDiagram'
import DbSchemaDiagram from './diagrams/DbSchemaDiagram'

interface SlideViewProps {
  step: Step
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

function OverviewSlide({ slide }: { slide: Slide }) {
  return (
    <>
      <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
        {slide.section}
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
        {slide.title}
      </h1>
      {slide.subtitle && <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>}
      <ul className="space-y-4 mt-8">
        {slide.points.map(point => (
          <li key={point.text} className="flex items-start gap-4 text-zinc-300 text-lg">
            <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function ZoomSlide({ slide, pointIndex }: { slide: Slide; pointIndex: number }) {
  const point = slide.points[pointIndex]
  const hasMedia = !!(point.image || point.video)
  const hasDiagram = !!point.diagram
  const hasCode = !!point.code

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <p className="font-mono text-xs text-[#e8ff00] uppercase tracking-widest">{slide.section}</p>
        <span className="text-zinc-600 font-mono text-xs">·</span>
        <p className="text-zinc-400 text-sm truncate">{slide.title}</p>
        <span className="ml-auto font-mono text-xs text-zinc-500 shrink-0">
          {String(pointIndex + 1).padStart(2, '0')} / {String(slide.points.length).padStart(2, '0')}
        </span>
      </div>

      {hasMedia ? (
        <div className="grid grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            {point.image && (
              <img
                src={asset(point.image)}
                alt={point.text}
                className="max-h-[60vh] w-full object-contain rounded-lg"
              />
            )}
            {point.video && (
              <video src={asset(point.video)} controls className="max-h-[60vh] w-full rounded-lg" />
            )}
          </div>
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
        </div>
      ) : hasDiagram ? (
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
          {point.diagram === 'architecture' ? <ArchitectureDiagram /> : <DbSchemaDiagram />}
        </div>
      ) : hasCode ? (
        <div className="grid grid-cols-2 gap-10 items-start">
          <p className="text-2xl font-semibold text-zinc-100 leading-snug pt-2">{point.text}</p>
          <pre className="bg-zinc-900 border border-zinc-700/60 rounded-xl p-5 text-sm text-[#e8ff00]/90 font-mono leading-relaxed overflow-auto max-h-[58vh] whitespace-pre">
            <code>{point.code}</code>
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[40vh]">
          <p className="text-3xl font-semibold text-zinc-100 leading-snug max-w-2xl">{point.text}</p>
        </div>
      )}
    </div>
  )
}

export default function SlideView({ step }: SlideViewProps) {
  const slide = SLIDES[step.slideIndex]
  return step.kind === 'overview' ? (
    <OverviewSlide slide={slide} />
  ) : (
    <ZoomSlide slide={slide} pointIndex={step.pointIndex} />
  )
}
```

Note: if Task 4 has not run yet, temporarily replace the two diagram imports and the `hasDiagram` branch body with `null` to keep this compiling, and restore them in Task 4. Prefer running Task 4 right after if you want the diagram branch live.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- --run src/test/SlideView.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Replace rendering in `Oral.tsx`**

In `src/pages/Oral.tsx`: delete the `ZoomSlide` component and its `ZoomSlideProps` interface (now inside `SlideView`). Replace the `<main>` inner block (the `step.kind === 'overview' ? (...) : <ZoomSlide .../>`) with:

```tsx
import SlideView from './oral/SlideView'
// ...
<main className="flex-1 flex items-center justify-center pt-24 pb-16 px-8 lg:px-24">
  <div
    key={`${step.slideIndex}-${step.kind}-${step.kind === 'zoom' ? step.pointIndex : ''}`}
    className={`w-full slide-enter ${step.kind === 'overview' ? 'max-w-3xl' : 'max-w-5xl'}`}
  >
    <SlideView step={step} />
  </div>
</main>
```

- [ ] **Step 6: Run full suite + type-check**

Run: `npm test -- --run && npx tsc --noEmit`
Expected: all PASS; tsc clean. (`Oral.test.tsx` still navigates `/oral`; note the `Oral` test that asserted a detail string after one click, if any, must now assert `point.text` — update it if it fails by asserting the zoomed point's `text` instead of `detail`.)

- [ ] **Step 7: Commit**

```bash
git add src/pages/oral/SlideView.tsx src/pages/Oral.tsx src/test/SlideView.test.tsx
git commit -m "refactor(oral): shared SlideView, keep detail off the projected screen"
```

---

## Task 3: `useOralSync` cross-window sync hook

**Files:**
- Create: `src/pages/oral/useOralSync.ts`
- Test: `src/test/useOralSync.test.tsx`

**Interfaces:**
- Produces: `function useOralSync(initial?: number): [number, (i: number) => void]`. Local nav via the returned setter broadcasts to other windows; inbound messages update local state without re-broadcasting.

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/useOralSync.test.tsx
import { describe, expect, it, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useOralSync } from '../pages/oral/useOralSync'

// Minimal in-process BroadcastChannel so two hook instances talk to each other.
class FakeChannel {
  static channels: FakeChannel[] = []
  onmessage: ((e: { data: unknown }) => void) | null = null
  constructor(public name: string) { FakeChannel.channels.push(this) }
  postMessage(data: unknown) {
    FakeChannel.channels
      .filter(c => c !== this && c.name === this.name)
      .forEach(c => c.onmessage?.({ data }))
  }
  close() { FakeChannel.channels = FakeChannel.channels.filter(c => c !== this) }
}

beforeEach(() => {
  FakeChannel.channels = []
  ;(globalThis as { BroadcastChannel: unknown }).BroadcastChannel = FakeChannel
})

describe('useOralSync', () => {
  it('propagates a step change from one window to another', () => {
    const a = renderHook(() => useOralSync(0))
    const b = renderHook(() => useOralSync(0))

    act(() => a.result.current[1](7))

    expect(a.result.current[0]).toBe(7)
    expect(b.result.current[0]).toBe(7)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/useOralSync.test.tsx`
Expected: FAIL — cannot resolve `../pages/oral/useOralSync`.

- [ ] **Step 3: Implement the hook**

```ts
// src/pages/oral/useOralSync.ts
import { useCallback, useEffect, useRef, useState } from 'react'

const CHANNEL = 'oral'
const STORAGE_KEY = 'oral:step'

export function useOralSync(initial = 0): [number, (i: number) => void] {
  const [stepIndex, setLocal] = useState(initial)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(CHANNEL)
      ch.onmessage = e => {
        const i = (e.data as { stepIndex?: number }).stepIndex
        if (typeof i === 'number') setLocal(i)
      }
      channelRef.current = ch
      return () => {
        ch.close()
        channelRef.current = null
      }
    }
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue != null) setLocal(Number(e.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setStepIndex = useCallback((i: number) => {
    setLocal(i)
    if (channelRef.current) {
      channelRef.current.postMessage({ stepIndex: i })
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(i))
    }
  }, [])

  return [stepIndex, setStepIndex]
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- --run src/test/useOralSync.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/pages/oral/useOralSync.ts src/test/useOralSync.test.tsx
git commit -m "feat(oral): add useOralSync cross-window step sync hook"
```

---

## Task 4: Architecture and DB diagrams

**Files:**
- Create: `src/pages/oral/diagrams/ArchitectureDiagram.tsx`
- Create: `src/pages/oral/diagrams/DbSchemaDiagram.tsx`
- Modify: `src/pages/oral/SlideView.tsx` (ensure the `diagram` branch renders them — already wired in Task 2)
- Modify: `src/pages/oral/slides.ts` (set `diagram` on the `architecture` and `bdd` slides)
- Test: `src/test/OralDiagrams.test.tsx`

**Interfaces:**
- Produces: default exports `ArchitectureDiagram` and `DbSchemaDiagram`, each a zero-prop component rendering a labelled diagram.

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/OralDiagrams.test.tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArchitectureDiagram from '../pages/oral/diagrams/ArchitectureDiagram'
import DbSchemaDiagram from '../pages/oral/diagrams/DbSchemaDiagram'

describe('diagrams', () => {
  it('architecture diagram shows the three layers', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText(/Presentation/i)).toBeInTheDocument()
    expect(screen.getByText(/Domain/i)).toBeInTheDocument()
    expect(screen.getByText(/Data/i)).toBeInTheDocument()
  })

  it('db schema shows the five entities', () => {
    render(<DbSchemaDiagram />)
    for (const e of ['CATEGORIES', 'PRODUCTS', 'CONTACTS', 'MEDIA_FILES', 'APP_SETTINGS']) {
      expect(screen.getByText(e)).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/OralDiagrams.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `ArchitectureDiagram.tsx`**

```tsx
// src/pages/oral/diagrams/ArchitectureDiagram.tsx
const LAYERS = [
  {
    name: 'Presentation',
    color: 'border-[#e8ff00]/60',
    items: ['Composables Compose', 'ViewModels (StateFlow)', 'États UI immuables'],
  },
  {
    name: 'Domain',
    color: 'border-zinc-500/60',
    items: ['Interfaces Repository', 'Modèles métier purs', 'Aucune dépendance Android'],
  },
  {
    name: 'Data',
    color: 'border-sky-400/50',
    items: ['RepositoryImpl', 'Room DAOs · SQLite', 'EmailService (SMTP)'],
  },
]

export default function ArchitectureDiagram() {
  return (
    <div className="flex flex-col gap-4">
      {LAYERS.map((layer, i) => (
        <div key={layer.name} className="flex flex-col items-center gap-2">
          <div className={`w-full rounded-xl border ${layer.color} bg-zinc-900/60 px-6 py-4`}>
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-2">
              {layer.name} Layer
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-zinc-200 text-sm">
              {layer.items.map(it => (
                <span key={it}>{it}</span>
              ))}
            </div>
          </div>
          {i < LAYERS.length - 1 && <span className="text-[#e8ff00] font-mono text-lg">↓</span>}
        </div>
      ))}
      <p className="text-center text-zinc-500 font-mono text-xs mt-2">
        Presentation → Domain ← Data · injection via Koin
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Implement `DbSchemaDiagram.tsx`**

```tsx
// src/pages/oral/diagrams/DbSchemaDiagram.tsx
const ENTITIES = [
  { name: 'CATEGORIES', fields: ['id PK', 'nom', 'emoji', 'imagePath', 'ordre'] },
  {
    name: 'PRODUCTS',
    fields: ['id PK', 'categoryId FK', 'nom', 'specs', 'imagePaths', 'videoPath', 'pdfPath'],
  },
  {
    name: 'CONTACTS',
    fields: ['id PK', 'societe', 'email', 'telephone', 'sectors', 'photoPath', 'status'],
  },
  { name: 'MEDIA_FILES', fields: ['id PK', 'fileName', 'filePath', 'mimeType', 'fileSize'] },
  { name: 'APP_SETTINGS', fields: ['key PK', 'value'] },
]

export default function DbSchemaDiagram() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {ENTITIES.map(entity => (
          <div key={entity.name} className="rounded-xl border border-zinc-700/60 bg-zinc-900/60">
            <p className="font-mono text-sm text-[#e8ff00] px-4 py-2 border-b border-zinc-700/60">
              {entity.name}
            </p>
            <ul className="px-4 py-2 space-y-0.5 text-zinc-300 text-xs font-mono">
              {entity.fields.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-zinc-500 font-mono text-xs">
        CATEGORIES 1—N PRODUCTS · cascade delete · CONTACTS.status: pending | sent | error
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Wire `diagram` on the data**

In `src/pages/oral/slides.ts`, find the slide with `id: 'architecture'`. Append `diagram: 'architecture'` to its first point object (the `Domain Layer` point), e.g. change that point to:

```ts
{ text: "Domain Layer — interfaces Repository, modèles métier purs", detail: "...inchangé...", diagram: 'architecture' },
```

Find the slide with `id: 'bdd'`. Append `diagram: 'db'` to its first point object (the `CATEGORIES` point):

```ts
{ text: "CATEGORIES — id, nom, description, emoji, imagePath, ordre", detail: "...inchangé...", diagram: 'db' },
```

(If a point already carries an `image`, do not also add `diagram` to the same point — pick a point without media. The first points of `architecture` and `bdd` have no media.)

- [ ] **Step 6: Restore the diagram branch in `SlideView` (if stubbed in Task 2)**

Ensure `SlideView.tsx` imports both diagrams and the `hasDiagram` branch renders
`point.diagram === 'architecture' ? <ArchitectureDiagram /> : <DbSchemaDiagram />` (as written in Task 2 Step 3).

- [ ] **Step 7: Run tests + type-check**

Run: `npm test -- --run src/test/OralDiagrams.test.tsx && npx tsc --noEmit`
Expected: PASS (2 tests); tsc clean.

- [ ] **Step 8: Commit**

```bash
git add src/pages/oral/diagrams src/pages/oral/SlideView.tsx src/pages/oral/slides.ts src/test/OralDiagrams.test.tsx
git commit -m "feat(oral): in-app MVVM and DB schema diagrams"
```

---

## Task 5: Public view sync + Presenter view + routes

**Files:**
- Modify: `src/pages/Oral.tsx` (use `useOralSync` instead of local `useState`; add a "Présentateur" link)
- Create: `src/pages/oral/PresenterView.tsx`
- Modify: `src/App.tsx:1,29-32`
- Test: `src/test/PresenterView.test.tsx`

**Interfaces:**
- Consumes: `useOralSync`, `SlideView`, `SLIDES`, `STEPS`, `Step` from `./oral/*`.
- Produces: default export `PresenterView` (route `/oral/presenter`): renders current `SlideView`, the current step's `detail` as notes, a "Suivant" preview, a timer (start/pause/reset), and a button to open the public window.

- [ ] **Step 1: Switch `Oral.tsx` to synced state**

In `src/pages/Oral.tsx`, replace `const [stepIndex, setStepIndex] = useState(0)` with:

```ts
import { useOralSync } from './oral/useOralSync'
// ...
const [stepIndex, setStepIndex] = useOralSync(0)
```

`prev`/`next` already call `setStepIndex`. Keep the `useState` import only if still used elsewhere (it is not after this change — remove `useState` from the React import if unused). Add a presenter link next to the "← Portfolio" link:

```tsx
<Link to="/oral/presenter" className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors">
  Présentateur ↗
</Link>
```

- [ ] **Step 2: Write the failing test**

```tsx
// src/test/PresenterView.test.tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PresenterView from '../pages/oral/PresenterView'
import { SLIDES } from '../pages/oral/slides'

describe('PresenterView', () => {
  it('shows the speaker notes for the current step and a timer', () => {
    render(
      <MemoryRouter>
        <PresenterView />
      </MemoryRouter>,
    )
    // First step is the title overview; its first point detail is the speaker note source.
    expect(screen.getByText(SLIDES[0].points[0].detail as string)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /démarrer|pause/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- --run src/test/PresenterView.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `PresenterView.tsx`**

```tsx
// src/pages/oral/PresenterView.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SlideView from './SlideView'
import { useOralSync } from './useOralSync'
import { SLIDES, STEPS } from './slides'

function notesFor(stepIndex: number): string[] {
  const step = STEPS[stepIndex]
  const slide = SLIDES[step.slideIndex]
  if (step.kind === 'overview') {
    return slide.points.map(p => p.detail).filter((d): d is string => !!d)
  }
  const detail = slide.points[step.pointIndex].detail
  return detail ? [detail] : []
}

function nextLabel(stepIndex: number): string {
  const next = STEPS[stepIndex + 1]
  if (!next) return 'Fin'
  const slide = SLIDES[next.slideIndex]
  return next.kind === 'overview' ? slide.title : slide.points[next.pointIndex].text
}

function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef<number | null>(null)
  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds(s => s + 1), 1000)
      return () => { if (ref.current) window.clearInterval(ref.current) }
    }
  }, [running])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return { label: `${mm}:${ss}`, running, toggle: () => setRunning(r => !r), reset: () => { setRunning(false); setSeconds(0) } }
}

export default function PresenterView() {
  const [stepIndex, setStepIndex] = useOralSync(0)
  const timer = useTimer()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setStepIndex(Math.max(0, stepIndex - 1))
      if (e.key === 'ArrowRight') setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepIndex, setStepIndex])

  const openPublic = () => window.open(`${import.meta.env.BASE_URL}oral`, 'oral-public')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans grid grid-cols-2 gap-6 p-6">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-[#e8ff00]">{timer.label}</span>
          <button
            onClick={timer.toggle}
            className="px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            {timer.running ? 'Pause' : 'Démarrer'}
          </button>
          <button
            onClick={timer.reset}
            className="px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            Reset
          </button>
          <button
            onClick={openPublic}
            className="ml-auto px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            Ouvrir la fenêtre public ↗
          </button>
          <Link to="/oral/notes" className="px-3 py-1 font-mono text-xs text-zinc-500 hover:text-[#e8ff00]">
            Notes ↗
          </Link>
        </div>
        <div className="flex-1 rounded-xl border border-zinc-800 p-6 overflow-auto">
          <SlideView step={STEPS[stepIndex]} />
        </div>
        <div className="flex justify-between font-mono text-xs text-zinc-500">
          <button onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>
            ← Précédent
          </button>
          <span>{stepIndex + 1} / {STEPS.length}</span>
          <button
            onClick={() => setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1))}
            disabled={stepIndex === STEPS.length - 1}
          >
            Suivant →
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex-1 rounded-xl border border-zinc-800 p-6 overflow-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-[#e8ff00] mb-4">Notes</p>
          <ul className="space-y-4 text-zinc-300 text-lg leading-relaxed">
            {notesFor(stepIndex).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-800 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1">Suivant</p>
          <p className="text-zinc-300">{nextLabel(stepIndex)}</p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Add the routes in `App.tsx`**

In `src/App.tsx`, add imports and routes:

```tsx
import PresenterView from './pages/oral/PresenterView'
import NotesPage from './pages/oral/NotesPage'
// ...
<Routes>
  <Route path="/" element={<Portfolio />} />
  <Route path="/oral" element={<Oral />} />
  <Route path="/oral/presenter" element={<PresenterView />} />
  <Route path="/oral/notes" element={<NotesPage />} />
</Routes>
```

(`NotesPage` is created in Task 6; if executing strictly in order, add its route and import in Task 6 instead and only add the `presenter` route here.)

- [ ] **Step 6: Run tests + type-check**

Run: `npm test -- --run src/test/PresenterView.test.tsx && npx tsc --noEmit`
Expected: PASS (1 test); tsc clean.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Oral.tsx src/pages/oral/PresenterView.tsx src/App.tsx src/test/PresenterView.test.tsx
git commit -m "feat(oral): synced public view + presenter view with notes and timer"
```

---

## Task 6: Printable notes page

**Files:**
- Create: `src/pages/oral/NotesPage.tsx`
- Modify: `src/App.tsx` (route + import, if not already added in Task 5)
- Test: `src/test/NotesPage.test.tsx`

**Interfaces:**
- Consumes: `SLIDES` from `./slides`.
- Produces: default export `NotesPage` (route `/oral/notes`): every slide's title, each point's `text` and `detail`, with print-friendly classes.

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/NotesPage.test.tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotesPage from '../pages/oral/NotesPage'
import { SLIDES } from '../pages/oral/slides'

describe('NotesPage', () => {
  it('lists every slide title', () => {
    render(<NotesPage />)
    for (const slide of SLIDES) {
      expect(screen.getAllByText(slide.title).length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/NotesPage.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `NotesPage.tsx`**

```tsx
// src/pages/oral/NotesPage.tsx
import { SLIDES } from './slides'

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans px-8 py-10 print:p-0">
      <h1 className="text-2xl font-bold mb-1">Notes d'orateur — SMP-Commercial</h1>
      <p className="text-zinc-500 text-sm mb-8 print:hidden">
        Imprime cette page (Ctrl/Cmd+P) ou garde-la sur ton téléphone.
      </p>
      <div className="space-y-8">
        {SLIDES.map((slide, i) => (
          <section key={slide.id} className="break-inside-avoid">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              {String(i + 1).padStart(2, '0')} · {slide.section}
            </p>
            <h2 className="text-lg font-semibold">{slide.title}</h2>
            {slide.subtitle && <p className="text-zinc-500 text-sm">{slide.subtitle}</p>}
            <ul className="mt-2 space-y-2">
              {slide.points.map(point => (
                <li key={point.text}>
                  <span className="font-medium">{point.text}</span>
                  {point.detail && (
                    <span className="block text-zinc-600 text-sm leading-relaxed">{point.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Ensure the route exists**

Confirm `src/App.tsx` has `<Route path="/oral/notes" element={<NotesPage />} />` and the import (added in Task 5 Step 5 or here).

- [ ] **Step 5: Run tests + type-check**

Run: `npm test -- --run src/test/NotesPage.test.tsx && npx tsc --noEmit`
Expected: PASS (1 test); tsc clean.

- [ ] **Step 6: Commit**

```bash
git add src/pages/oral/NotesPage.tsx src/App.tsx src/test/NotesPage.test.tsx
git commit -m "feat(oral): printable speaker-notes page at /oral/notes"
```

---

## Task 7: More real code snippets and screenshots

**Files:**
- Modify: `src/pages/oral/slides.ts` (add `code` to a few points; point image references at the unused `*2.png` / app screenshots)

**Interfaces:**
- Consumes: nothing new. Pure data edits using the `SlidePoint` fields already defined.

- [ ] **Step 1: Add a real ViewModel/StateFlow snippet**

In `slides.ts`, on the `schema-archi` slide (Flux de données), add `code` to the `ViewModel` point. Use real shape from `~/SMP-Commercial/.../ContactHistoryViewModel.kt`:

```ts
{
  text: "ViewModel — expose états UI, orchestre les cas d'usage",
  detail: "...inchangé...",
  code: `private val _uiState = MutableStateFlow(ContactHistoryUiState())
val uiState: StateFlow<ContactHistoryUiState> = _uiState.asStateFlow()

private fun loadContacts() {
    viewModelScope.launch {
        contactRepository.getAllContacts().collect { contacts ->
            _uiState.update { it.copy(allContacts = contacts) }
        }
    }
}`,
},
```

- [ ] **Step 2: Add a Room DAO snippet**

On the `c3` slide (C3 — Base de données), add `code` to the "Room ORM avec DAOs typés" point:

```ts
{
  text: "Room ORM avec DAOs typés (ContactDao, ProductDao, etc.)",
  detail: "...inchangé...",
  code: `@Dao
interface ContactDao {
    @Query("SELECT * FROM contacts ORDER BY createdAt DESC")
    fun getAllContacts(): Flow<List<Contact>>

    @Insert
    suspend fun insert(contact: Contact): Long
}`,
},
```

- [ ] **Step 3: Surface the unused screenshot variants**

The files `public/oral/code/room-flow2.png`, `email-service2.png`, `mockk-test1.png`, `mockk-test2.png` exist but are unreferenced. Add a second point (or set `image`) where relevant — e.g. on the `tests` slide, set `image: '/oral/code/mockk-test1.png'` on the `ContactHistoryViewModelTest` point:

```ts
{ text: "ContactHistoryViewModelTest — 5 cas couverts", detail: "...inchangé...", image: '/oral/code/mockk-test1.png' },
```

- [ ] **Step 4: Verify all referenced images exist**

Run:
```bash
grep -oP "image: '\K[^']+" src/pages/oral/slides.ts | sort -u | while read p; do [ -f "public$p" ] && echo "OK $p" || echo "MISSING $p"; done
```
Expected: every line starts with `OK`. Fix any `MISSING` by pointing to an existing file in `public/oral/`.

- [ ] **Step 5: Build, test, and visually verify**

Run: `npm run build && npm test -- --run`
Expected: build succeeds; all tests PASS.

Then run `npm run preview`, open `http://localhost:4173/portfolio/oral/presenter`, click "Ouvrir la fenêtre public", and confirm: navigating in one window moves the other; notes/timer show only in presenter; diagrams and code render; images load (Content-Type `image/*`, not the HTML fallback).

- [ ] **Step 6: Commit**

```bash
git add src/pages/oral/slides.ts
git commit -m "feat(oral): add real code snippets and surface screenshot variants"
```

---

## Self-Review Notes

- **Spec coverage:** public/presenter/notes routes (Tasks 5–6), `BroadcastChannel` sync (Task 3), `SlideView` with detail off-screen (Task 2), diagrams (Task 4), more code + screenshots (Task 7), tests in every task, 58 slides untouched (no curation task), printable notes kept (Task 6). All spec items mapped.
- **Type consistency:** `useOralSync(initial?: number): [number, (i: number) => void]`, `SlideViewProps { step: Step }`, `SlidePoint.diagram?: 'architecture' | 'db'`, `Step` discriminated union — used consistently across Tasks 1–6.
- **Deviation from spec:** `SlideView` carries no `mode` prop (detail never rendered there; notes live only in `PresenterView`/`NotesPage`). Noted in File Structure.
- **Ordering caveat:** `SlideView` (Task 2) imports the diagrams created in Task 4. Execute Task 4 immediately after Task 2, or stub the diagram branch as noted, to keep intermediate commits compiling.
