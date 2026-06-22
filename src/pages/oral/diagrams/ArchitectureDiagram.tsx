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
        3 couches strictement séparées · injection via Koin
      </p>
    </div>
  )
}
