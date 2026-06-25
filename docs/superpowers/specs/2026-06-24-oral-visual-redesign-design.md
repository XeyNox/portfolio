# Oral — Enrichissement visuel & allègement du support

**Date :** 2026-06-24
**Branche :** `feat/oral-presentation-mode`
**Statut :** design validé, prêt pour le plan d'implémentation

## Contexte & problème

Le support d'oral (`src/pages/oral/`) compte **58 slides, dont 41 (71 %) en pur texte à puces**.
Le rendu génère pour chaque slide un step *overview* (titre + liste de toutes les puces),
puis un step *zoom* plein écran par point « visuel » (image / vidéo / code / diagramme).

Le champ `detail` de chaque point n'est **pas affiché** à l'écran : c'est le script orateur
(PresenterView). Les puces écran sont donc déjà courtes. Le problème n'est pas la longueur
des puces mais **l'absence d'ancrage visuel sur les slides overview** : des dizaines de slides
décrivent des écrans réels de l'app ou des concepts comparatifs sans aucun visuel.

## Objectifs

1. **Enrichir** : donner un ancrage visuel à la majorité des slides (captures réelles,
   diagrammes/comparaisons en code, data viz).
2. **Alléger** : passer de 58 à **~47 slides** via des fusions ciblées (sans toucher au
   niveau de détail de la section Fonctionnalités, conservée écran par écran).

## Non-objectifs

- Pas de refonte du mécanisme de zoom par point (il reste tel quel pour les deep-dives code).
- Pas de refonte de `useOralSync` / `PresenterView` / navigation.
- Pas de photos de contexte (salon, tablette physique).

## Décisions actées

- **Approche A** : visuel au niveau de la slide, affiché sur l'overview à côté des puces.
- **Fonctionnalités** : 15 slides conservées (1 screenshot chacune), pas de fusion agressive.
- **Compétences RNCP** : 6 slides conservées (1 intro + C1→C5), allégées à ≤4 puces + visuel.
- **Screenshots** : capturés par l'utilisateur ; le code prépare les emplacements.

---

## Modèle de données

Extension de `src/pages/oral/slides.ts` :

```ts
export type SlideVisual =
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'diagram'; name: 'architecture' | 'db' }
  | { kind: 'stats'; items: { value: string; label: string }[] }
  | { kind: 'compare'; columns: { heading: string; rows: string[] }[] }

export interface Slide {
  id: string
  section: string
  title: string
  subtitle?: string
  visual?: SlideVisual   // NOUVEAU — rendu sur le step overview
  points: SlidePoint[]
}
```

`SlidePoint` est inchangé. `generateSteps` / `isVisual` / `Step` sont **inchangés** :
le `visual` de slide ne crée pas de step supplémentaire, il enrichit l'overview existant.

---

## Rendu

### `OverviewSlide` (adaptatif)

- **Sans `visual`** → rendu actuel (centré, `max-w-3xl`), inchangé.
- **Avec `visual`** → layout 2 colonnes (`grid lg:grid-cols-2 gap-12 items-center`) :
  puces resserrées à gauche, visuel à droite. Le conteneur passe à `max-w-5xl`
  (cf. `Oral.tsx:97`, qui choisit la largeur selon `step.kind`).

`Oral.tsx` devra élargir l'overview à `max-w-5xl` **quand la slide a un `visual`**
(sinon garder `max-w-3xl`). Petite condition à ajouter sur le calcul de `className`.

### Rendu du `visual` — fonction `renderVisual(visual: SlideVisual)`

| `kind` | Composant | Notes |
|--------|-----------|-------|
| `image` | `<img>` + `asset()` | réutilise le helper `asset()` existant, `max-h-[60vh]` |
| `diagram` | `ArchitectureDiagram` / `DbSchemaDiagram` | composants existants |
| `stats` | `StatGrid` (nouveau) | data viz grands chiffres |
| `compare` | `CompareColumns` (nouveau) | comparaison côte à côte |

---

## Nouveaux composants

### `src/pages/oral/visuals/StatGrid.tsx`

```ts
interface StatGridProps { items: { value: string; label: string }[] }
```

Grille responsive de cartes : `value` en grand (typo bold, accent `#e8ff00`),
`label` en petit dessous. 2 colonnes mobile / 3 colonnes large. Tailwind only.

### `src/pages/oral/visuals/CompareColumns.tsx`

```ts
interface CompareColumnsProps {
  columns: { heading: string; rows: string[] }[]
}
```

2 à 3 colonnes côte à côte, chacune avec un `heading` (badge accent) et une liste
de `rows` (puces courtes). Bordures `zinc-700/60`, fond `zinc-900`, cohérent avec
le style des blocs code existants.

Les deux composants suivent `.claude/rules/code-style.md` (props interface au-dessus,
destructuration, Tailwind ordonné) et sont testés (`src/test/`).

---

## Assets — captures d'écran

- Dossier : `public/oral/app/`
- Convention : `/oral/app/<id-slide>.jpg` (référencé via `visual.src = '/oral/app/<id>.jpg'`)
- Réutilisation : `app-accueil.jpg`, `app-catalogue.jpg`, `app-contact.jpg`
  (déjà dans `public/oral/figma/`).

### Shot list (à capturer par l'utilisateur, format portrait tablette)

| id slide | écran |
|---|---|
| accueil | écran d'accueil branding |
| catalogue | grille de catégories *(ou réutiliser app-catalogue)* |
| produit-detail | fiche produit avec onglets |
| pdf | viewer PDF |
| video | lecteur vidéo |
| contact-form | formulaire rempli *(ou réutiliser app-contact)* |
| rgpd | dialogue de consentement RGPD |
| historique | liste des leads avec statuts |
| export | écran export |
| admin | panel admin en mode édition |
| kiosque | mode plein écran |
| responsive | phone + tablette côte à côte |

Tant qu'une capture manque, la slide reste sans `image` (fallback texte actuel) —
aucune régression, on branche au fur et à mesure.

---

## Plan slide-par-slide (cible ~47 slides)

Légende visuel : 📊 StatGrid · 🔀 CompareColumns · 🖼️ screenshot · 📐 diagramme · 💻 code (zoom existant)

### Introduction (5 → 3)
1. `titre` + `entreprise` fusionnés — 📊 (50+ ans, 1000+ moules, 3 secteurs, 100% Made in France)
2. `problematique` — 📊 ou puces (papier / contacts perdus / pas de vidéo)
3. `objectifs` + `cdc-objectifs` fusionnés (« Objectifs & cahier des charges ») — 📊 (5 objectifs, offline = priorité)

### Conception (8 → 7)
4. `choix-plateforme` — 🔀 (Natif Kotlin vs React Native/Flutter vs PWA)
5. `cdc-pivots` — 🔀 (CDC → Livraison, avant/après)
6. `maquettes` — 🖼️ (figma existant)
7. `evolution-ui` — 🖼️ (app images existantes)
8. `architecture` + `schema-archi` (flux) fusionnés — 📐 architecture (+ 💻 flux en zoom)
9. `bdd` — 📐 db
10. `di` — 💻 (existant)

### Stack (3 → 2)
11. `stack` — 📊 (versions clés : Kotlin 2.1, Compose, Room 2.6, Koin 3.5, minSdk 24…)
12. `stack-media` + `stack-services` fusionnés (« Librairies & services ») — puces 2 colonnes

### Fonctionnalités (15 → 15, conservées)
13. `navigation-ui` — 💻 (existant)
14. `accueil` — 🖼️
15. `catalogue` — 🖼️
16. `produit-detail` — 🖼️
17. `pdf` — 🖼️
18. `video` — 🖼️
19. `contact-form` — 🖼️
20. `camera` — 💻 (existant) + 🖼️ optionnel
21. `rgpd` — 🖼️
22. `historique` — 🖼️
23. `export` — 🖼️
24. `pdf-generation` — 🖼️ ou puces
25. `admin` — 🖼️
26. `kiosque` — 💻 (existant)
27. `multilingue` — 💻 (existant)

### Qualité (6 → 5)
28. `responsive` — 🖼️ (phone+tablette)
29. `securite` + `permissions` fusionnés (« Sécurité & permissions ») — puces
30. `tests` — 🖼️ (existant)
31. `qualite-bugs` — puces
32. `performances` — 💻 (existant)

### Insights (4 → 4) — chacune en 🔀
33. `room-reactive` — 🔀 (Flow réactif vs one-shot)
34. `coroutines-pratique` — 🔀 (withContext vs launch)
35. `koin-scoping` — 🔀 (single vs factory vs viewModel)
36. `stateflow-livedata` — 🔀 (StateFlow vs LiveData)

### Compétences (6 → 6, allégées ≤4 puces)
37. `rncp-intro` — 📊 (C1→C5 en badges)
38. `c1` — visuel léger / puces
39. `c2` — puces
40. `c3` — 💻 (existant)
41. `c4` — puces
42. `c5` — puces

### Bilan (5 → 4)
43. `chiffres-cles` — 📊 (vitrine : 9700 lignes, 70 fichiers, 13 écrans, 10+ libs…)
44. `bilan-technique` + `bilan-personnel` fusionnés — puces
45. `bilan-entreprise` — puces
46. `perspectives` — puces

### Conclusion (1)
47. `conclusion` — inchangée

---

## Tests

- `StatGrid.test.tsx` : rend N cartes valeur+label.
- `CompareColumns.test.tsx` : rend N colonnes avec heading + rows.
- `SlideView.test.tsx` (étendu) : un overview avec `visual.kind='stats'` rend la StatGrid ;
  avec `visual.kind='compare'` rend CompareColumns ; sans `visual` garde le rendu centré.
- Lint zéro warning, `npm run build` (type-check) vert.

## Séquence de construction

1. Modèle `SlideVisual` + rendu adaptatif `OverviewSlide` + condition largeur dans `Oral.tsx` (+ tests).
2. `StatGrid` et `CompareColumns` (+ tests).
3. Réécriture `slides.ts` : fusions (Intro, Conception, Stack, Qualité, Bilan), allègement
   Compétences, attache des `visual` en code (Insights 🔀, stats 📊).
4. Slots screenshots (`visual.src` pointant vers `/oral/app/<id>.jpg`) — branchés quand
   l'utilisateur fournit les captures.

## Risques

- **Fusions = perte de steps de zoom code** : vérifier qu'aucun snippet code utile n'est
  supprimé lors des fusions (ex. `schema-archi` garde son code en zoom).
- **Largeur overview** : la bascule `max-w-3xl` → `max-w-5xl` ne doit pas casser les overviews
  sans visuel.
- **Tests existants** : `SlideView.test.tsx` / `Oral.test.tsx` peuvent dépendre du nombre de
  slides/steps — à mettre à jour après la réécriture de contenu.
