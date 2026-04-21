import { useScramble } from '../hooks/useScramble'

const SKILLS_MARQUEE = [
  'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker',
  'Next.js', 'TailwindCSS', 'GraphQL', 'Redis', 'Linux',
]

export default function Hero() {
  const line1 = useScramble('Loic', 300)
  const line2 = useScramble('Michaud', 900)

  return (
    <section data-testid="hero" className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-[600px] h-[600px] bg-accent/10 top-[-100px] right-[-200px]" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/10 bottom-[10%] left-[-100px]" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-64 pt-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">

          {/* Left — display title */}
          <div>
            <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase mb-6">
              Développeur Full-Stack
            </p>
            <h1 className="text-[clamp(4rem,14vw,12rem)] font-black leading-[0.88] tracking-tight text-white">
              <span className="block">{line1.display}</span>
              <span className="block text-accent">{line2.display}</span>
            </h1>
          </div>

          {/* Right — description + CTA */}
          <div className="lg:max-w-xs lg:pb-4 space-y-8">
            <p className="text-zinc-400 leading-relaxed text-sm">
              Je construis des applications web modernes, performantes et accessibles.
              Passionné par le code propre et les interfaces qui marquent.
            </p>
            <div className="flex gap-4">
              <a
                href="#projects"
                className="magnetic inline-flex items-center gap-2 px-5 py-3 bg-accent text-zinc-950
                           font-mono text-xs tracking-widest uppercase font-bold rounded-full
                           hover:scale-105 transition-transform duration-300"
              >
                Projets
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contact"
                className="magnetic inline-flex items-center px-5 py-3 border border-white/20
                           text-white font-mono text-xs tracking-widest uppercase rounded-full
                           hover:border-white/50 transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-500 to-transparent" />
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 border-t border-white/5 py-4 overflow-hidden">
        <div className="marquee-track">
          {[...SKILLS_MARQUEE, ...SKILLS_MARQUEE].map((skill, i) => (
            <span key={i} className="font-mono text-xs tracking-widest uppercase text-zinc-600 px-8">
              {skill}
              <span className="text-accent ml-8">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
