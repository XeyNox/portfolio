import { useState, type FormEvent } from 'react'
import { useReveal } from '../hooks/useReveal'

interface FormState {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const titleRef = useReveal()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" data-testid="contact" className="relative py-32 px-6 lg:px-10">

      {/* Full-bleed background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-20">
          <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">03</span>
          <div className="h-px flex-1 max-w-16 bg-white/10" />
          <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">Contact</span>
        </div>

        <div ref={titleRef as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[0.9] mb-8">
              On<br />
              <span className="text-accent">travaille</span><br />
              ensemble ?
            </h2>
            <p className="text-zinc-500 text-sm font-mono tracking-widest">
              Réponse sous 48h.
            </p>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                role="status"
                data-testid="success-message"
                className="flex flex-col items-start gap-4 py-12"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-2xl font-black text-white">Message envoyé !</p>
                <p className="text-zinc-400 text-sm">Je vous recontacte rapidement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate data-testid="contact-form" className="space-y-5">
                {[
                  { id: 'name', label: 'Nom', type: 'text', placeholder: 'Jean Dupont', key: 'name' as const },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'jean@example.com', key: 'email' as const },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block font-mono text-[10px] tracking-widest text-zinc-500 uppercase mb-2">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      value={form[field.key]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-transparent border-b border-white/10 text-white placeholder-zinc-700
                                 py-3 text-sm focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] tracking-widest text-zinc-500 uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Décrivez votre projet..."
                    className="w-full bg-transparent border-b border-white/10 text-white placeholder-zinc-700
                               py-3 text-sm focus:border-accent focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="magnetic inline-flex items-center gap-3 px-7 py-4 bg-accent text-zinc-950
                               font-mono text-xs tracking-widest uppercase font-bold rounded-full
                               hover:scale-105 transition-transform duration-300"
                  >
                    Envoyer le message
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
