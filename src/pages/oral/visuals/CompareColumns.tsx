interface CompareColumnsProps {
  columns: { heading: string; rows: string[] }[]
}

export default function CompareColumns({ columns }: CompareColumnsProps) {
  const colsClass = columns.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
  return (
    <div className={`grid grid-cols-1 gap-5 ${colsClass}`}>
      {columns.map(column => (
        <div
          key={column.heading}
          className="flex flex-col gap-4 rounded-xl border border-zinc-700/60 bg-zinc-900 p-5"
        >
          <span className="w-fit rounded bg-[#e8ff00]/10 px-2 py-1 font-mono text-xs uppercase tracking-widest text-[#e8ff00]">
            {column.heading}
          </span>
          <ul className="space-y-2">
            {column.rows.map(row => (
              <li key={row} className="flex gap-2 text-sm leading-snug text-zinc-300">
                <span className="shrink-0 text-[#e8ff00]">·</span>
                <span>{row}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
