"use client"

import { useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState("")
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [totalTests, setTotalTests] = useState<number | null>(null)
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then((d) => setTotalTests(d.total)).catch(() => {})
  }, [])

  async function startTest() {
    setLoading(true)
    const res = await fetch("/api/test", { method: "POST" })
    const data = await res.json()
    router.push(`/test/${data.id}`)
  }

  function lookupResult() {
    const val = uuid.trim()
    if (val) router.push(`/result/${val}`)
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
            <h1 className="text-3xl font-bold tracking-tight">Tes DISC</h1>
            <p className="mt-2 text-sm text-zinc-400">24 Soal Personality Assessment</p>
          </div>

          <div className="p-6">
            <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
              Temukan profil kepribadian <strong className="text-foreground">Dominance (D)</strong>,{" "}
              <strong className="text-foreground">Influence (I)</strong>,{" "}
              <strong className="text-foreground">Steadiness (S)</strong>, dan{" "}
              <strong className="text-foreground">Compliance (C)</strong> Anda.
            </p>

            <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground">Petunjuk</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ring" />
                  <span>Setiap soal punya <strong className="text-foreground">4 pernyataan</strong>. Pilih <strong className="text-foreground">P (Paling)</strong> untuk yang paling menggambarkan diri Anda dan <strong className="text-foreground">K (Kurang)</strong> untuk yang paling tidak menggambarkan.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ring" />
                  <span>Satu pernyataan tidak bisa jadi P dan K sekaligus.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ring" />
                  <span>Jawablah dengan jujur — tidak ada jawaban benar atau salah.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startTest}
              disabled={loading}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Menyiapkan..." : "Mulai Tes"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">atau</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sudah selesai? Lihat hasil:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan UUID"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookupResult()}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
                <button
                  onClick={lookupResult}
                  disabled={mounted && !uuid.trim()}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-zinc-800 disabled:opacity-40"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {totalTests !== null && (
        <div className="fixed bottom-4 right-4 animate-fade-in rounded-md border border-border bg-card px-4 py-2.5 shadow-sm">
          <span className="text-xs text-muted-foreground">
            <strong className="text-foreground">{totalTests}</strong> tes tersubmit
          </span>
        </div>
      )}
    </div>
  )
}
