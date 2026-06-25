# Oral — Enrichissement visuel & allègement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Donner un ancrage visuel à la majorité des slides de l'oral (data viz, comparaisons en code, captures) et alléger de 58 à ~47 slides via des fusions ciblées.

**Architecture :** Ajout d'un champ `visual?` au niveau de la `Slide` (rendu sur le step *overview* à côté des puces). Deux nouveaux composants présentationnels purs (`StatGrid`, `CompareColumns`). Le mécanisme de zoom par point reste intact.

**Tech Stack :** React 18 + TypeScript + Vite + TailwindCSS, Vitest + @testing-library/react.

## Global Constraints

- **Style** (`.claude/rules/code-style.md`) : `interface` pour les props, destructuration dans la signature, jamais `any`, Tailwind utilities only (ordre layout→sizing→spacing→typography→color→effects→responsive), pas de point-virgule, single quotes en TS, double quotes en JSX, 2 espaces, virgules finales multi-lignes.
- **Tests** (`.claude/rules/testing.md`) : co-localisés dans `src/test/`, un fichier par composant, `getByRole`/`getByText` sémantiques, Vitest.
- **Lint zéro warning** : `npm run lint` doit passer. **Type-check** : `npm run build`.
- **Couleur accent** : `#e8ff00` (jaune), fonds `zinc-900`, bordures `zinc-700/60` — cohérent avec les blocs code existants.
- **GitNexus** (`CLAUDE.md`) : lancer `gitnexus_impact({target, direction:"upstream"})` avant de modifier un symbole existant (`OverviewSlide`, `SlideView`), et `gitnexus_detect_changes()` avant chaque commit.
- **Commits** (`.claude/rules/git-workflow.md`) : Conventional Commits, sujet ≤72 car., impératif. Terminer le message par `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Helper existant** : `asset(path)` dans `SlideView.tsx` préfixe `import.meta.env.BASE_URL`. À réutiliser pour toute image.

---

### Task 1: Composant StatGrid

**Files:**
- Create: `src/pages/oral/visuals/StatGrid.tsx`
- Test: `src/test/StatGrid.test.tsx`

**Interfaces:**
- Produces: `export default function StatGrid({ items }: StatGridProps)` où `interface StatGridProps { items: { value: string; label: string }[] }`

- [ ] **Step 1: Write the failing test**

`src/test/StatGrid.test.tsx`
```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatGrid from '../pages/oral/visuals/StatGrid'

describe('StatGrid', () => {
  it('renders a value and label for each item', () => {
    render(
      <StatGrid
        items={[
          { value: '50+', label: 'ans' },
          { value: '1000+', label: 'moules' },
        ]}
      />,
    )
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('ans')).toBeInTheDocument()
    expect(screen.getByText('1000+')).toBeInTheDocument()
    expect(screen.getByText('moules')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/StatGrid.test.tsx`
Expected: FAIL — `Cannot find module '../pages/oral/visuals/StatGrid'`

- [ ] **Step 3: Write minimal implementation**

`src/pages/oral/visuals/StatGrid.tsx`
```tsx
interface StatGridProps {
  items: { value: string; label: string }[]
}

export default function StatGrid({ items }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
      {items.map(item => (
        <div
          key={item.label}
          className="flex flex-col gap-2 rounded-xl border border-zinc-700/60 bg-zinc-900 p-6"
        >
          <span className="font-mono text-3xl font-bold text-[#e8ff00]">{item.value}</span>
          <span className="text-sm leading-snug text-zinc-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/test/StatGrid.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/pages/oral/visuals/StatGrid.tsx src/test/StatGrid.test.tsx
git commit -m "feat(oral): add StatGrid visual component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Composant CompareColumns

**Files:**
- Create: `src/pages/oral/visuals/CompareColumns.tsx`
- Test: `src/test/CompareColumns.test.tsx`

**Interfaces:**
- Produces: `export default function CompareColumns({ columns }: CompareColumnsProps)` où `interface CompareColumnsProps { columns: { heading: string; rows: string[] }[] }`

- [ ] **Step 1: Write the failing test**

`src/test/CompareColumns.test.tsx`
```tsx
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompareColumns from '../pages/oral/visuals/CompareColumns'

describe('CompareColumns', () => {
  it('renders each column heading and its rows', () => {
    render(
      <CompareColumns
        columns={[
          { heading: 'Flow', rows: ['réactif', 're-émet'] },
          { heading: 'one-shot', rows: ['une fois'] },
        ]}
      />,
    )
    expect(screen.getByText('Flow')).toBeInTheDocument()
    expect(screen.getByText('réactif')).toBeInTheDocument()
    expect(screen.getByText('re-émet')).toBeInTheDocument()
    expect(screen.getByText('one-shot')).toBeInTheDocument()
    expect(screen.getByText('une fois')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/CompareColumns.test.tsx`
Expected: FAIL — `Cannot find module '../pages/oral/visuals/CompareColumns'`

- [ ] **Step 3: Write minimal implementation**

`src/pages/oral/visuals/CompareColumns.tsx`
```tsx
interface CompareColumnsProps {
  columns: { heading: string; rows: string[] }[]
}

export default function CompareColumns({ columns }: CompareColumnsProps) {
  const colsClass = columns.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <div className={`grid grid-cols-1 gap-5 ${colsClass}`}>
      {columns.map(column => (
        <div
          key={column.heading}
          className="flex flex-col gap-4 rounded-xl border border-zinc-700/60 bg-zinc-900 p-5"
        >
          <span className="w-fit rounded bg-[#e8ff00]/10 px-2 py-1 font-mono text-xs uppercase tracking-widest text-[#e8ff00]">
            {column.heading}
          </span>
          <ul className="space-y-2">
            {column.rows.map(row => (
              <li key={row} className="flex gap-2 text-sm leading-snug text-zinc-300">
                <span className="shrink-0 text-[#e8ff00]">·</span>
                <span>{row}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/test/CompareColumns.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/pages/oral/visuals/CompareColumns.tsx src/test/CompareColumns.test.tsx
git commit -m "feat(oral): add CompareColumns visual component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Type SlideVisual + rendu adaptatif de l'overview

**Files:**
- Modify: `src/pages/oral/slides.ts` (interface `Slide` + nouveau type `SlideVisual`, près des lignes 1-16)
- Modify: `src/pages/oral/SlideView.tsx` (imports + `renderVisual` + `OverviewSlide` exporté et adaptatif)
- Modify: `src/pages/Oral.tsx:97` (largeur overview selon présence d'un `visual`)
- Test: `src/test/SlideView.test.tsx` (3 cas ajoutés)

**Interfaces:**
- Consumes: `StatGrid` (Task 1), `CompareColumns` (Task 2), `ArchitectureDiagram`/`DbSchemaDiagram` (existants), `asset()` (existant dans SlideView).
- Produces:
  - `export type SlideVisual = { kind: 'image'; src: string; caption?: string } | { kind: 'diagram'; name: 'architecture' | 'db' } | { kind: 'stats'; items: { value: string; label: string }[] } | { kind: 'compare'; columns: { heading: string; rows: string[] }[] }`
  - `Slide` gagne `visual?: SlideVisual`
  - `export function OverviewSlide({ slide }: { slide: Slide })`

- [ ] **Step 1: Run impact analysis (GitNexus)**

Run (MCP): `gitnexus_impact({ target: "OverviewSlide", direction: "upstream" })`
Reporter le blast radius. Attendu : faible (OverviewSlide consommé uniquement par SlideView). Si HIGH/CRITICAL, prévenir avant de continuer.

- [ ] **Step 2: Write the failing tests**

Ajouter dans `src/test/SlideView.test.tsx` — modifier l'import de la ligne 3 en :
```tsx
import SlideView, { OverviewSlide } from '../pages/oral/SlideView'
```
puis ajouter le type et les 3 cas dans le `describe('SlideView', ...)` :
```tsx
import type { Slide } from '../pages/oral/slides'

it('renders a stats visual alongside bullets on an overview slide', () => {
  const slide: Slide = {
    id: 't',
    section: 'S',
    title: 'Titre',
    visual: { kind: 'stats', items: [{ value: '9 700', label: 'lignes Kotlin' }] },
    points: [{ text: 'point un' }],
  }
  render(<OverviewSlide slide={slide} />)
  expect(screen.getByText('9 700')).toBeInTheDocument()
  expect(screen.getByText('lignes Kotlin')).toBeInTheDocument()
  expect(screen.getByText('point un')).toBeInTheDocument()
})

it('renders a compare visual on an overview slide', () => {
  const slide: Slide = {
    id: 'c',
    section: 'S',
    title: 'Cmp',
    visual: { kind: 'compare', columns: [{ heading: 'A', rows: ['r1'] }, { heading: 'B', rows: ['r2'] }] },
    points: [{ text: 'p' }],
  }
  render(<OverviewSlide slide={slide} />)
  expect(screen.getByText('A')).toBeInTheDocument()
  expect(screen.getByText('r1')).toBeInTheDocument()
})

it('renders bullets only when the slide has no visual', () => {
  const slide: Slide = { id: 'n', section: 'S', title: 'NoVis', points: [{ text: 'solo' }] }
  render(<OverviewSlide slide={slide} />)
  expect(screen.getByText('solo')).toBeInTheDocument()
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- --run src/test/SlideView.test.tsx`
Expected: FAIL — `OverviewSlide` n'est pas exporté / `visual` n'existe pas sur `Slide`.

- [ ] **Step 4: Extend the data model**

Dans `src/pages/oral/slides.ts`, juste avant `export interface Slide` (ligne 10), ajouter :
```ts
export type SlideVisual =
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'diagram'; name: 'architecture' | 'db' }
  | { kind: 'stats'; items: { value: string; label: string }[] }
  | { kind: 'compare'; columns: { heading: string; rows: string[] }[] }
```
Puis ajouter le champ dans `Slide` (après `subtitle?: string`) :
```ts
  visual?: SlideVisual
```

- [ ] **Step 5: Make OverviewSlide adaptive**

Dans `src/pages/oral/SlideView.tsx` :

Remplacer l'import de la ligne 1 par :
```tsx
import { SLIDES, type Slide, type SlideVisual, type Step } from './slides'
import ArchitectureDiagram from './diagrams/ArchitectureDiagram'
import DbSchemaDiagram from './diagrams/DbSchemaDiagram'
import StatGrid from './visuals/StatGrid'
import CompareColumns from './visuals/CompareColumns'
```

Ajouter, après la fonction `asset()` (ligne 11), la fonction de rendu de visuel :
```tsx
function renderVisual(visual: SlideVisual) {
  switch (visual.kind) {
    case 'image':
      return (
        <figure className="flex flex-col items-center gap-3">
          <img
            src={asset(visual.src)}
            alt={visual.caption ?? ''}
            className="max-h-[60vh] w-full rounded-lg object-contain"
          />
          {visual.caption && <figcaption className="text-sm text-zinc-500">{visual.caption}</figcaption>}
        </figure>
      )
    case 'diagram':
      return visual.name === 'architecture' ? <ArchitectureDiagram /> : <DbSchemaDiagram />
    case 'stats':
      return <StatGrid items={visual.items} />
    case 'compare':
      return <CompareColumns columns={visual.columns} />
  }
}
```

Remplacer entièrement la fonction `OverviewSlide` (lignes 13-33) par :
```tsx
export function OverviewSlide({ slide }: { slide: Slide }) {
  const header = (
    <>
      <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
        {slide.section}
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
        {slide.title}
      </h1>
      {slide.subtitle && <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>}
    </>
  )

  const bullets = (
    <ul className="space-y-4 mt-8">
      {slide.points.map(point => (
        <li key={point.text} className="flex items-start gap-4 text-zinc-300 text-lg">
          <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
          <span>{point.text}</span>
        </li>
      ))}
    </ul>
  )

  if (!slide.visual) {
    return (
      <>
        {header}
        {bullets}
      </>
    )
  }

  return (
    <div className="grid gap-12 items-center lg:grid-cols-2">
      <div>
        {header}
        {bullets}
      </div>
      <div className="flex items-center justify-center">{renderVisual(slide.visual)}</div>
    </div>
  )
}
```

- [ ] **Step 6: Widen the overview container when a visual is present**

Dans `src/pages/Oral.tsx`, remplacer le bloc `className` de la ligne 97 par :
```tsx
          className={`w-full slide-enter ${
            step.kind === 'overview' && !SLIDES[step.slideIndex].visual ? 'max-w-3xl' : 'max-w-5xl'
          }`}
```
(`SLIDES` est déjà importé dans `Oral.tsx`.)

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- --run src/test/SlideView.test.tsx`
Expected: PASS (5 tests : 2 existants + 3 nouveaux)

- [ ] **Step 8: Type-check and lint**

Run: `npm run build && npm run lint`
Expected: build OK, zéro warning ESLint.

- [ ] **Step 9: Detect changes and commit**

Run (MCP): `gitnexus_detect_changes()` — vérifier que seuls `slides.ts`, `SlideView.tsx`, `Oral.tsx` sont touchés.
```bash
git add src/pages/oral/slides.ts src/pages/oral/SlideView.tsx src/pages/Oral.tsx src/test/SlideView.test.tsx
git commit -m "feat(oral): render slide-level visual on overview steps

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Section Insights → 4 visuels CompareColumns

**Files:**
- Modify: `src/pages/oral/slides.ts` (slides `room-reactive`, `coroutines-pratique`, `koin-scoping`, `stateflow-livedata`)

**Interfaces:**
- Consumes: champ `visual` (Task 3) avec `kind: 'compare'`.

Pour chaque slide ci-dessous, ajouter la propriété `visual` juste après `subtitle` (avant `points`). Ne pas toucher aux `points`/`detail` existants (ils restent le script orateur).

- [ ] **Step 1: room-reactive**

Ajouter à la slide `id: 'room-reactive'` :
```ts
    visual: {
      kind: 'compare',
      columns: [
        {
          heading: 'Flow<T> — réactif',
          rows: [
            'Trigger SQLite interne',
            'Re-émet à chaque INSERT/UPDATE/DELETE',
            'UI synchronisée, zéro polling',
            'Pour une liste qui doit rester à jour',
          ],
        },
        {
          heading: 'suspend fun — one-shot',
          rows: [
            "S'exécute une fois, retourne",
            'Pas de collector à gérer',
            'Pour une lecture unique (détail produit)',
            'val id = 0 → sentinelle autoGenerate',
          ],
        },
      ],
    },
```

- [ ] **Step 2: coroutines-pratique**

Ajouter à la slide `id: 'coroutines-pratique'` :
```ts
    visual: {
      kind: 'compare',
      columns: [
        {
          heading: 'withContext(IO)',
          rows: [
            'Switch de thread',
            'Le parent attend le résultat',
            'Reprend sur le dispatcher d’origine',
            'Idéal pour une I/O qui retourne (SMTP)',
          ],
        },
        {
          heading: 'launch(IO)',
          rows: [
            'Nouvelle coroutine (Job indépendant)',
            'Le parent continue sans attendre',
            'Fire-and-forget',
            'Pas de résultat sans Deferred',
          ],
        },
      ],
    },
```

- [ ] **Step 3: koin-scoping**

Ajouter à la slide `id: 'koin-scoping'` :
```ts
    visual: {
      kind: 'compare',
      columns: [
        {
          heading: 'single',
          rows: [
            'Une instance pour toute l’app',
            'Repository, AppDatabase, EmailService',
            '⚠ ViewModel en single = fuite mémoire',
          ],
        },
        {
          heading: 'factory',
          rows: [
            'Nouvelle instance à chaque get()',
            '⚠ Repository en factory = cache vide',
            'Rarement le bon choix ici',
          ],
        },
        {
          heading: 'viewModel',
          rows: [
            'Lié au ViewModelStore Android',
            'Survit aux rotations',
            'Détruit en quittant l’écran',
          ],
        },
      ],
    },
```

- [ ] **Step 4: stateflow-livedata**

Ajouter à la slide `id: 'stateflow-livedata'` :
```ts
    visual: {
      kind: 'compare',
      columns: [
        {
          heading: 'LiveData',
          rows: [
            'Importe androidx.lifecycle',
            'ViewModel dépendant d’Android',
            'Test : InstantTaskExecutorRule requis',
            '.value nullable → NPE possible',
          ],
        },
        {
          heading: 'StateFlow',
          rows: [
            'kotlinx-coroutines, zéro Android',
            'Testable en JVM pur (runTest)',
            'Valeur initiale obligatoire',
            'collectAsStateWithLifecycle() côté UI',
          ],
        },
      ],
    },
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build && npm run lint && npm test -- --run`
Expected: tout vert.
```bash
git add src/pages/oral/slides.ts
git commit -m "feat(oral): add comparison visuals to Insights slides

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Visuels StatGrid (data viz) + fusions Introduction

**Files:**
- Modify: `src/pages/oral/slides.ts`

**Interfaces:**
- Consumes: champ `visual` avec `kind: 'stats'`.

- [ ] **Step 1: Fusionner `entreprise` dans `titre`**

Supprimer entièrement l'objet slide `id: 'entreprise'` (lignes ~31-42). Sur la slide `id: 'titre'`, ajouter après `subtitle` :
```ts
    visual: {
      kind: 'stats',
      items: [
        { value: '50+', label: 'ans d’expertise' },
        { value: '1000+', label: 'moules produits' },
        { value: '3', label: 'secteurs : pharma · cosméto · emballage' },
        { value: '100%', label: 'Made in France' },
      ],
    },
```

- [ ] **Step 2: Fusionner `objectifs` dans `cdc-objectifs`**

Supprimer entièrement l'objet slide `id: 'objectifs'` (lignes ~55-66). Sur la slide `id: 'cdc-objectifs'`, changer `title` en `'Objectifs & cahier des charges'` et ajouter après `subtitle` :
```ts
    visual: {
      kind: 'stats',
      items: [
        { value: '5', label: 'objectifs fonctionnels' },
        { value: '2', label: 'profils : visiteur · admin' },
        { value: '100%', label: 'hors ligne — priorité absolue' },
      ],
    },
```

- [ ] **Step 3: StatGrid sur `stack`**

Ajouter à la slide `id: 'stack'` après `subtitle` :
```ts
    visual: {
      kind: 'stats',
      items: [
        { value: 'Kotlin 2.1', label: 'langage (compilateur K2)' },
        { value: 'Compose', label: 'UI Material 3' },
        { value: 'Room 2.6', label: 'persistance SQLite' },
        { value: 'Koin 3.5', label: 'injection de dépendances' },
        { value: 'minSdk 24', label: 'Android 7.0 → 95% du parc' },
        { value: 'target 35', label: 'Android 15' },
      ],
    },
```

- [ ] **Step 4: StatGrid sur `chiffres-cles`**

Ajouter à la slide `id: 'chiffres-cles'` après `subtitle` :
```ts
    visual: {
      kind: 'stats',
      items: [
        { value: '~9 700', label: 'lignes de Kotlin' },
        { value: '70', label: 'fichiers' },
        { value: '13', label: 'écrans' },
        { value: '7', label: 'ViewModels' },
        { value: '5', label: 'entités Room' },
        { value: '10+', label: 'librairies majeures' },
      ],
    },
```

- [ ] **Step 5: StatGrid (badges) sur `rncp-intro`**

Ajouter à la slide `id: 'rncp-intro'` après `subtitle` :
```ts
    visual: {
      kind: 'stats',
      items: [
        { value: 'C1', label: 'Architecture applicative' },
        { value: 'C2', label: 'Interfaces utilisateur' },
        { value: 'C3', label: 'Base de données' },
        { value: 'C4', label: 'Composants métier' },
        { value: 'C5', label: 'Contexte professionnel' },
      ],
    },
```

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm test -- --run`
Expected: tout vert (le test `SlideView` cas 1 utilise `SLIDES[0].title` = `titre`, toujours en index 0).
```bash
git add src/pages/oral/slides.ts
git commit -m "feat(oral): add stat visuals and merge intro slides

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Fusions restantes + allègement Compétences

**Files:**
- Modify: `src/pages/oral/slides.ts`

Chaque fusion = combiner les `points` (en gardant les objets existants tels quels, avec leur `detail`/`image`/`code`) puis supprimer l'objet slide absorbé.

- [ ] **Step 1: `schema-archi` → `architecture`**

Objectif : préserver le snippet de code « flux de données » (le point `id`/text `ViewModel — expose états UI…` qui porte `code:`). Depuis la slide `id: 'schema-archi'`, copier **uniquement** le point dont le `text` commence par `"ViewModel — expose états UI"` (il porte le `code`) et l'ajouter à la fin du tableau `points` de la slide `id: 'architecture'`. Puis supprimer entièrement l'objet slide `id: 'schema-archi'`.

- [ ] **Step 2: `stack-media` + `stack-services` → « Librairies & services »**

Sur la slide `id: 'stack-media'` : changer `title` en `'Librairies & services'`. Copier les 4 points de `stack-services` à la suite des points de `stack-media` (8 points au total). Supprimer entièrement l'objet slide `id: 'stack-services'`.

- [ ] **Step 3: `securite` + `permissions` → « Sécurité & permissions »**

Sur la slide `id: 'securite'` : changer `title` en `'Sécurité & permissions'`. Conserver ses 5 points. Depuis `permissions`, ajouter le point dont le `text` commence par `"CAMERA déclarée en feature optionnelle"` (le plus distinctif). Supprimer entièrement l'objet slide `id: 'permissions'`. Résultat : 6 points.

- [ ] **Step 4: `bilan-technique` + `bilan-personnel` → un seul bilan**

Sur la slide `id: 'bilan-technique'` : changer `title` en `'Bilan technique & personnel'`. Garder ses 5 points, puis ajouter depuis `bilan-personnel` les 2 points dont les `text` commencent par `"Architecture logicielle"` et `"Communication technique"`. Supprimer entièrement l'objet slide `id: 'bilan-personnel'`. Résultat : 7 points.

- [ ] **Step 5: Alléger Compétences C1→C5 (≤4 puces)**

Pour chacune des slides `id: 'c1'`, `'c2'`, `'c4'`, `'c5'` (PAS `c3` qui porte du code), supprimer le **5ᵉ point** de chaque tableau `points` (garder les 4 premiers). `c4` a 6 points → garder les 4 premiers. Ne pas modifier les `detail`.

- [ ] **Step 6: Verify and commit**

Run: `npm run build && npm run lint && npm test -- --run`
Expected: tout vert.
```bash
git add src/pages/oral/slides.ts
git commit -m "refactor(oral): merge redundant slides and trim competence bullets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Brancher les captures d'écran disponibles

**Files:**
- Modify: `src/pages/oral/slides.ts`

Les images réutilisables existent déjà dans `public/oral/figma/`. Les captures manquantes seront ajoutées par l'utilisateur dans `public/oral/app/` puis branchées au fil de l'eau (checklist finale).

- [ ] **Step 1: Brancher les 3 captures déjà disponibles**

Ajouter le `visual` correspondant après le `subtitle` (ou après `title` si pas de `subtitle`) :

Slide `id: 'accueil'` :
```ts
    visual: { kind: 'image', src: '/oral/figma/app-accueil.jpg', caption: 'Écran d’accueil' },
```
Slide `id: 'catalogue'` :
```ts
    visual: { kind: 'image', src: '/oral/figma/app-catalogue.jpg', caption: 'Grille de catégories' },
```
Slide `id: 'contact-form'` :
```ts
    visual: { kind: 'image', src: '/oral/figma/app-contact.jpg', caption: 'Formulaire de capture' },
```

- [ ] **Step 2: Verify and commit**

Run: `npm run build && npm run lint && npm test -- --run`
Expected: tout vert.
```bash
git add src/pages/oral/slides.ts
git commit -m "feat(oral): wire existing app screenshots to feature slides

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 3: Checklist captures à fournir (hors code)**

Quand l'utilisateur dépose les fichiers dans `public/oral/app/`, ajouter pour chaque slide un `visual: { kind: 'image', src: '/oral/app/<id>.jpg', caption: '…' }`. Slides en attente : `produit-detail`, `pdf`, `video`, `rgpd`, `historique`, `export`, `admin`, `kiosque`, `responsive` (phone + tablette). Vérifier que le fichier existe **avant** de référencer son `src` (sinon image 404 à l'écran).

---

## Self-Review

**Spec coverage :**
- Modèle `SlideVisual` → Task 3 ✓
- Rendu 2 colonnes overview + largeur Oral.tsx → Task 3 ✓
- `StatGrid` → Task 1 ✓ ; `CompareColumns` → Task 2 ✓
- Réutilisation diagrammes architecture/db → Task 3 (`renderVisual` case `diagram`) ✓
- Insights → CompareColumns → Task 4 ✓
- Stats (titre, objectifs, stack, chiffres-cles, rncp-intro) → Task 5 ✓
- Fusions Intro → Task 5 ; Conception/Stack/Qualité/Bilan → Task 6 ✓
- Compétences allégées (1 intro + C1→C5) → Task 6 step 5 ✓
- Screenshots (convention `/oral/app/`, réutilisation figma) → Task 7 ✓
- Tests StatGrid/CompareColumns/SlideView → Tasks 1, 2, 3 ✓

**Placeholder scan :** aucun TBD/TODO ; tout le code net-nouveau (composants, visuels stats/compare) est fourni en entier ; les fusions référencent des points existants par leur `text` (sans réécrire les `detail` longs, pour éviter toute erreur de transcription).

**Type consistency :** `StatGridProps.items: { value, label }[]` et `SlideVisual` `kind:'stats'.items` identiques ✓ ; `CompareColumnsProps.columns: { heading, rows }[]` et `kind:'compare'.columns` identiques ✓ ; `OverviewSlide` exporté en Task 3, consommé par le test du même task ✓.

**Cible slides :** 58 − 1 (entreprise) − 1 (objectifs) − 1 (schema-archi) − 1 (stack-services) − 1 (permissions) − 1 (bilan-personnel) = **52**. NB : la cible « ~47 » du spec supposait des fusions plus agressives en Fonctionnalités, abandonnées sur ta demande (section conservée détaillée). 52 slides, quasiment toutes avec un ancrage visuel — cohérent avec la priorité « enrichir > fusionner ».
