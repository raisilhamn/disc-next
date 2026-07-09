"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function BatchEntryPage() {
  const { batchId } = useParams<{ batchId: string }>()
  const router = useRouter()
  const [label, setLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetch(`/api/batch/${batchId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setLabel(d.label)
      })
      .catch(() => setError("Gagal memuat link"))
      .finally(() => setLoading(false))
  }, [batchId])

  async function startTest() {
    if (!name.trim()) return
    setStarting(true)
    setError("")
    try {
      const res = await fetch(`/api/batch/${batchId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Gagal memulai tes")
        setStarting(false)
        return
      }
      router.push(`/test/${data.id}`)
    } catch {
      setError("Gagal terhubung ke server")
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!label) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">!</div>
          <p className="text-lg font-medium text-destructive">{error || "Link tidak ditemukan"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="bg-zinc-900 p-8 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Tes DISC</h1>
            <p className="mt-2 text-sm text-zinc-400">{label}</p>
          </div>

          <div className="p-6">
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Masukkan nama lengkap Anda untuk memulai tes 24 soal.
            </p>

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startTest()}
              className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {error && <p className="mb-4 text-xs font-medium text-destructive">{error}</p>}

            <button
              onClick={startTest}
              disabled={starting || !name.trim()}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {starting ? "Menyiapkan..." : "Mulai Tes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
