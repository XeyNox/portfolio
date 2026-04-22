# Portfolio — XeyNox

Portfolio personnel développé avec React 18, TypeScript, Vite et TailwindCSS.

**Live** → [xeynox.github.io/portfolio](https://xeynox.github.io/portfolio/)

## Stack

- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** pour le style
- **React Router v6** pour la navigation
- **Vitest** + **Testing Library** pour les tests
- **GitHub Actions** pour le déploiement continu

## Contenu

| Section | Description |
|---|---|
| Hero | Accroche animée avec effet de scramble |
| About | Présentation et compétences |
| Projects | Projets : oral RNCP, jeu Mielus Belly, exemples |
| Contact | Liens de contact |
| `/oral` | Présentation orale de fin d'année (47 diapositives) |

## Développement

```bash
npm install
npm run dev          # serveur local http://localhost:5173/portfolio/
npm test             # tests en mode watch
npm test -- --run    # tests une seule fois
npm run build        # build de production
```

## Déploiement

Le déploiement est automatique via GitHub Actions à chaque push sur `main`.  
Le site est publié sur GitHub Pages à l'adresse **https://xeynox.github.io/portfolio/**.

Pour activer GitHub Pages lors de la première mise en place :  
Dépôt → Settings → Pages → Source → **GitHub Actions**
