import { useReveal } from '../hooks/useReveal'
import { skills } from '../data/portfolio'

export default function About() {
  const titleRef = useReveal()
  const contentRef = useReveal()

  return (
    <section id="about" data-testid="about" className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-20">
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">01</span>
        <div className="h-px flex-1 max-w-16 bg-white/10" />
        <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">À propos</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-start">

        {/* Left */}
        <div ref={titleRef as React.RefObject<HTMLDivElement>} className="reveal">
          <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[0.9] mb-10">
            Coder<br />
            <span className="text-zinc-600">c'est un art</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-4 text-sm">
            Développeur passionné avec une expertise dans la création d'applications web
            de bout en bout. J'aime travailler sur des problèmes complexes et transformer
            des idées en produits concrets qui ont un vrai impact.
          </p>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Disponible pour des missions freelance ou des opportunités en CDI.
          </p>
        </div>

        {/* Right — skills as a grid of pills */}
        <div ref={contentRef as React.RefObject<HTMLDivElement>} className="reveal reveal-delay-2">
          <div className="space-y-8">
            {skills.map((group) => (
              <div key={group.category}>
                <p className="font-mono text-[10px] tracking-widest text-accent uppercase mb-3">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 border border-white/10 text-zinc-300 text-xs font-mono
                                 rounded-full hover:border-accent/40 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Number stat decorations */}
          <div className="grid grid-cols-2 gap-6 mt-12 pt-10 border-t border-white/5">
            {[
              { n: '3', label: 'ans d\'expérience' },
              { n: '2', label: 'projets livrés et d\'autres commencés' },
            ].map(({ n, label }) => (
              <div key={n}>
                <p className="text-5xl font-black text-accent">{n}</p>
                <p className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
