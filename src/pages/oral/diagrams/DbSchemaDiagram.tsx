const ENTITIES = [
  { name: 'CATEGORIES', fields: ['id PK', 'nom', 'emoji', 'imagePath', 'ordre'] },
  {
    name: 'PRODUCTS',
    fields: ['id PK', 'categoryId FK', 'nom', 'specs', 'imagePaths', 'videoPath', 'pdfPath'],
  },
  {
    name: 'CONTACTS',
    fields: ['id PK', 'societe', 'email', 'telephone', 'sectors', 'photoPath', 'status'],
  },
  { name: 'MEDIA_FILES', fields: ['id PK', 'fileName', 'filePath', 'mimeType', 'fileSize'] },
  { name: 'APP_SETTINGS', fields: ['key PK', 'value'] },
]

export default function DbSchemaDiagram() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {ENTITIES.map(entity => (
          <div key={entity.name} className="rounded-xl border border-zinc-700/60 bg-zinc-900/60">
            <p className="font-mono text-sm text-[#e8ff00] px-4 py-2 border-b border-zinc-700/60">
              {entity.name}
            </p>
            <ul className="px-4 py-2 space-y-0.5 text-zinc-300 text-xs font-mono">
              {entity.fields.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-zinc-500 font-mono text-xs">
        CATEGORIES 1—N PRODUCTS · cascade delete · CONTACTS.status: pending | sent | error
      </p>
    </div>
  )
}
