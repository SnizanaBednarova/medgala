'use client'

import { useEffect, useState } from 'react'

export default function DownloadTicketsPage() {
  const [orderId, setOrderId] = useState<string>('')
  const [files, setFiles] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const o = params.get('order') || ''
    setOrderId(o)
    if (!o) {
      setError('Chybí číslo objednávky.')
      return
    }
    fetch(`/api/tickets/list?order=${encodeURIComponent(o)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Nepodařilo se načíst seznam lístků')
        return r.json()
      })
      .then((data) => setFiles(data.files || []))
      .catch((e) => setError((e as Error).message))
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br bg-primary-300 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="font-serif tracking-[0.22em] text-3xl md:text-5xl">Stažení vstupenek</h1>
        {error && <p className="mt-6 text-red-300">{error}</p>}
        {!error && files === null && <p className="mt-6 text-white/70">Načítám…</p>}
        {!error && files && files.length === 0 && (
          <p className="mt-6 text-white/70">Žádné soubory k dispozici.</p>
        )}
        {!error && files && files.length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="text-white/80">Objednávka: <span className="font-mono">{orderId}</span></p>
            <ul className="list-disc pl-6 space-y-2">
              {files.map((f) => (
                <li key={f}>
                  <a className="text-cyan-300 underline" href={`/api/tickets/download?order=${encodeURIComponent(orderId)}&file=${encodeURIComponent(f)}`}>
                    {f}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
