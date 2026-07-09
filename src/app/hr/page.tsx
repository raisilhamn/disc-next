"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"

type Batch = { id: string; label: string; createdAt: string; testCount: number }

export default function HrDashboard() {
  const [batches, setBatches] = useState<Batch[] | null>(null)
  const [label, setLabel] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function loadBatches() {
    fetch("/api/hr/batches")
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []))
      .catch(() => setError("Gagal memuat daftar batch"))
  }

  useEffect(() => {
    loadBatches()
  }, [])

  async function createBatch(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) return
    setCreating(true)
    setError("")
    try {
      const res = await fetch("/api/hr/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Gagal membuat batch")
        return
      }
      setLabel("")
      loadBatches()
    } catch {
      setError("Gagal terhubung ke server")
    } finally {
      setCreating(false)
    }
  }

  function copyBatchLink(id: string) {
    const url = `${window.location.origin}/b/${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000)
    })
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Dashboard HR</h1>
        <button
          onClick={() => signOut({ redirectTo: "/login" })}
          className="rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          Keluar
        </button>
      </div>

      <form onSubmit={createBatch} className="mb-6 flex gap-2 rounded-lg border border-border bg-card p-4 shadow-sm">
        <input
          type="text"
          placeholder="Nama batch, mis. Rekrutmen Maret 2026"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        <button
          type="submit"
          disabled={creating || !label.trim()}
          className="shrink-0 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-40"
        >
          {creating ? "Membuat..." : "Buat Batch"}
        </button>
      </form>

      {error && <p className="mb-4 text-xs font-medium text-destructive">{error}</p>}

      {batches === null ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : batches.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada batch. Buat batch pertama di atas.</p>
      ) : (
        <div className="space-y-2">
          {batches.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <Link href={`/hr/batch/${b.id}`} className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{b.label}</div>
                <div className="text-xs text-muted-foreground">{b.testCount} hasil</div>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => copyBatchLink(b.id)}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
                >
                  {copiedId === b.id ? "Tersalin!" : "Salin Link"}
                </button>
                <Link
                  href={`/hr/batch/${b.id}`}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800"
                >
                  Lihat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
