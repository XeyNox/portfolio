import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Slide {
  id: string
  nav: string
  title: string
  subtitle?: string
  points: string[]
}

const SLIDES: Slide[] = [
  {
    id: 'titre',
    nav: 'Titre',
    title: 'Titre du projet',
    subtitle: 'Présentation orale — Titre RNCP Développeur Full Stack',
    points: ['Votre nom', "Entreprise d'accueil", 'Année 20XX–20XX'],
  },
  {
    id: 'contexte',
    nav: 'Contexte',
    title: "Contexte de l'alternance",
    points: [
      "Présentation de l'entreprise",
      'Votre rôle et mission',
      'Durée · Équipe · Environnement de travail',
    ],
  },
  {
    id: 'projet',
    nav: 'Projet',
    title: 'Présentation du projet',
    subtitle: 'Quel problème résout-il ?',
    points: ['Problématique métier', 'Objectifs et périmètre', 'Public cible'],
  },
  {
    id: 'stack',
    nav: 'Stack',
    title: 'Stack technique',
    points: [
      'Frontend — ex : React, TypeScript',
      'Backend — ex : Node.js, Express',
      'Base de données — ex : PostgreSQL',
      'DevOps — ex : Docker, CI/CD',
    ],
  },
  {
    id: 'architecture',
    nav: 'Architecture',
    title: 'Architecture & fonctionnalités',
    points: [
      'Structure du projet',
      'Fonctionnalité clé 1',
      'Fonctionnalité clé 2',
      'Fonctionnalité clé 3',
    ],
  },
  {
    id: 'defis',
    nav: 'Défis',
    title: 'Défis & solutions',
    points: [
      'Défi technique rencontré',
      'Solution mise en place',
      'Ce que vous avez appris',
    ],
  },
  {
    id: 'competences',
    nav: 'Compétences',
    title: 'Compétences acquises',
    subtitle: 'En lien avec le référentiel RNCP',
    points: [
      'Concevoir et développer une application full stack',
      'Travailler en équipe / méthodes agiles',
      'Gérer un projet de A à Z',
      'Compétence transversale',
    ],
  },
  {
    id: 'conclusion',
    nav: 'Conclusion',
    title: 'Conclusion',
    points: [
      'Bilan personnel',
      "Apport pour l'entreprise",
      'Perspectives et évolutions possibles',
      '→ Questions ?',
    ],
  },
]

export default function Oral() {
  const [current, setCurrent] = useState(0)
  const total = SLIDES.length

  const prev = useCallback(() => setCurrent(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setCurrent(i => Math.min(total - 1, i + 1)), [total])

  useEffect(() => {
    document.body.dataset.oral = 'true'
    return () => { delete document.body.dataset.oral }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const slide = SLIDES[current]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <Link
          to="/"
          className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors"
        >
          ← Portfolio
        </Link>
        <span className="font-mono text-xs text-zinc-500">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <nav className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Diapositive précédente"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            aria-label="Diapositive suivante"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </nav>
      </header>

      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={`Aller à : ${s.nav}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-2 h-2 bg-[#e8ff00] scale-125'
                : 'w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      <main className="flex-1 flex items-center justify-center pt-20 pb-16 px-8 lg:px-24">
        <div key={slide.id} className="w-full max-w-3xl slide-enter">
          <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
            {slide.nav}
          </p>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>
          )}
          <ul className="space-y-5 mt-10">
            {slide.points.map(point => (
              <li key={point} className="flex items-start gap-4 text-zinc-300 text-xl">
                <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-zinc-800/60">
        <div
          className="h-full bg-[#e8ff00] transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
