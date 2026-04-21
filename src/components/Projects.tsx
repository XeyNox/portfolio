import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { projects, type Project } from '../data/portfolio'
import GameModal from './GameModal'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top } = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - left}px`)
    el.style.setProperty('--my', `${e.clientY - top}px`)
  }

  const isLarge = index === 0

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      data-testid="project-card"
      className={`card-glow relative border border-white/5 rounded-2xl overflow-hidden group
                  bg-zinc-900/40 backdrop-blur-sm transition-all duration-500
                  hover:border-white/10 ${isLarge ? 'lg:col-span-2' : ''}`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-0">
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Code source de ${project.title}`}
              className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-full
                         text-zinc-500 hover:text-white hover:border-white/30 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Démo live de ${project.title}`}
              className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-full
                         text-zinc-500 hover:text-white hover:border-white/30 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {project.internalUrl && (
            <Link
              to={project.internalUrl}
              aria-label={`Voir la présentation : ${project.title}`}
              className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-full
                         text-zinc-500 hover:text-[#e8ff00] hover:border-[#e8ff00]/40 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </Link>
          )}
          {project.playUrl && (
            <button
              onClick={() => setIsPlaying(true)}
              aria-label={`Jouer à ${project.title}`}
              className="w-7 h-7 flex items-center justify-center border border-white/10 rounded-full
                         text-zinc-500 hover:text-[#e8ff00] hover:border-[#e8ff00]/40 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isPlaying && project.playUrl && (
        <GameModal
          title={project.title}
          url={project.playUrl}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 p-6 ${isLarge ? 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-end' : ''}`}>
        <div>
          <h3 className={`font-black tracking-tight text-white group-hover:text-accent transition-colors
                          ${isLarge ? 'text-4xl lg:text-5xl mb-4' : 'text-2xl mb-3'}`}>
            {project.title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{project.description}</p>
        </div>
        <div className={`flex flex-wrap gap-2 ${isLarge ? 'lg:justify-end mt-4 lg:mt-0' : 'mt-5'}`}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-white/5 text-zinc-400 text-[10px] font-mono tracking-widest uppercase rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const titleRef = useReveal()

  return (
    <section id="projects" data-testid="projects" className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto">

      {/* Section label */}
      <div className="flex items-center gap-4 mb-20">
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">02</span>
        <div className="h-px flex-1 max-w-16 bg-white/10" />
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">Projets sélectionnés</span>
      </div>

      <div ref={titleRef as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

    </section>
  )
}
