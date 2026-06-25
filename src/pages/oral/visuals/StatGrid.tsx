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
