# Refonte de la présentation Oral — Design

**Date :** 2026-06-22
**Branche :** `feat/oral-presentation-mode`
**Statut :** validé (design), spec en revue

## Problème

La page `/oral` (présentation de soutenance RNCP, projet SMP-Commercial) n'est pas adaptée à un oral projeté de 40 minutes :

- **Mur de texte.** Sur 281 points de zoom, 280 affichent un paragraphe `detail` à l'écran. L'écran porte donc le discours au lieu de l'appuyer.
- **Peu de visuel.** Seulement 15 points sur 281 ont une image, 1 a du code, 0 vidéo.
- **Volume.** ~339 étapes de navigation (58 overview + 281 zoom) — beaucoup trop pour 40 min si parcouru linéairement.

## Format cible (décidé)

Les slides sont un **support projeté** ; l'orateur développe à côté. Donc :

- L'écran projeté ne porte que **section + titre + mots-clés + visuel**.
- Le texte détaillé devient des **notes d'orateur privées**.
- On ajoute des **visuels construits dans l'app** (diagrammes, code, captures).

## Décisions

| Sujet | Décision |
|---|---|
| Texte `detail` | Devient note d'orateur (jamais projeté), réutilisé pour un doc imprimable, écran condensé aux mots-clés. |
| Mode présentateur | **Double fenêtre synchronisée** (public + présentateur). |
| Visuels | Schéma archi MVVM + schéma BDD (rendus app), plus d'extraits de code réels, meilleure exploitation des captures. |

## Architecture

Une seule source de données `SLIDES` (et `generateSteps`/`STEPS` inchangés). Trois vues :

| Route | Rôle | Contenu |
|---|---|---|
| `/oral` | Fenêtre **public** (projecteur) | `SlideView` seule : section + titre + mots-clés + visuel. Aucune note. |
| `/oral/presenter` | Fenêtre **présentateur** (écran orateur) | `SlideView` réduite + notes (`detail`) + chrono + aperçu étape suivante + bouton « Ouvrir la fenêtre public ». |
| `/oral/notes` | **Doc imprimable** | Toutes les slides + notes, CSS `@media print`. Secours papier/téléphone. |

### Synchronisation des deux fenêtres

- Canal `BroadcastChannel('oral')`, avec repli `localStorage` + event `storage`.
- Message : `{ stepIndex: number }`. Toute navigation (flèches/boutons) dans une fenêtre diffuse l'index ; l'autre fenêtre s'aligne. Bidirectionnel.
- Le bouton « Ouvrir la fenêtre public » fait `window.open('<base>oral', 'oral-public')`. L'orateur glisse cette fenêtre sur le projecteur (écran étendu, pas miroir).
- Garde-fou anti-boucle : on n'émet pas si l'index reçu == index courant.

### Composants

- `SlideView` (nouveau) — extrait du rendu actuel (overview + zoom). **Prop `mode: 'public' | 'presenter'`** : en `public`, le `detail` n'est jamais rendu. Réutilisé par les 3 routes.
- `useOralSync` (hook) — encapsule `BroadcastChannel`/`localStorage`, expose `[stepIndex, setStepIndex]` synchronisés entre fenêtres.
- `PresenterView` — layout présentateur : slide courante, notes de l'étape, aperçu « suivant », chrono (start/pause/reset).
- `NotesPage` — page imprimable dérivée de `SLIDES`.
- `ArchitectureDiagram` — 3 couches MVVM/Clean (Presentation → Domain ← Data) + flux StateFlow/Room, en CSS/SVG, sans asset externe.
- `DbSchemaDiagram` — 5 entités Room (CATEGORIES, PRODUCTS, CONTACTS, MEDIA_FILES, APP_SETTINGS) en cartes reliées par leurs FK.

### Modèle de données

`SlidePoint` gagne un champ optionnel :

```ts
interface SlidePoint {
  text: string
  detail?: string          // → notes orateur, jamais projeté
  image?: string
  video?: string
  code?: string
  diagram?: 'architecture' | 'db'   // nouveau : rendu par un composant
}
```

`detail` reste tel quel dans les données (source unique des notes) — non réécrit.

## Contenu ajouté

- **Diagrammes** : la slide `architecture` (Conception) pointe `diagram: 'architecture'` ; la slide `bdd` pointe `diagram: 'db'`.
- **Code réel** (tiré de `~/SMP-Commercial`) sur quelques points clés : un ViewModel/StateFlow, un DAO Room, un extrait EmailService (en plus du SMTP existant).
- **Captures** : brancher les variantes `*2.png` inutilisées et les screenshots app sur les points de fonctionnalités pertinents.

## Rythme (hors périmètre build, recommandation)

Le chrono + un repère de section dans la vue présentateur aident à doser. Marquage « optionnel / annexe » de certaines slides possible dans une 2e itération si souhaité — non inclus ici.

## Tests

- `SlideView` : en `mode='public'`, `detail` absent du DOM ; en `presenter`, présent.
- `useOralSync` : un `setStepIndex` dans une instance se propage à l'autre (BroadcastChannel mocké).
- `ArchitectureDiagram` / `DbSchemaDiagram` : rendu sans erreur, libellés clés présents.
- `NotesPage` : contient toutes les slides.
- Les tests existants (`Oral.test.tsx`, `generateSteps`) restent verts ; la vue `/oral` reste navigable au clavier.

## Hors périmètre

- Pas de réécriture des `detail`.
- Pas de suppression de slides (curation = itération ultérieure).
- Pas de dual-screen via l'API Presentation native (un `window.open` synchronisé suffit).

## Phasage proposé

1. `SlideView` partagé + retrait du `detail` du rendu public.
2. `useOralSync` + routes `/oral` (public) et `/oral/presenter` + chrono.
3. Diagrammes `ArchitectureDiagram` + `DbSchemaDiagram` + champ `diagram`.
4. Contenu : code réel + captures mieux exploitées.
5. `/oral/notes` imprimable.
