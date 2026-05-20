"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState("")
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

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
        <div className="overflow-hidden rounded-2xl border border-sage-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-sage-600 to-sage-700 p-8 text-center text-white">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Tes DISC</h1>
            <p className="mt-2 text-sm text-white/80">24 Soal Personality Assessment</p>
          </div>

          <div className="p-6">
            <p className="mb-6 text-center text-sm leading-relaxed text-sage-700">
              Temukan profil kepribadian <strong>Dominance (D)</strong>, <strong>Influence (I)</strong>,{" "}
              <strong>Steadiness (S)</strong>, dan <strong>Compliance (C)</strong> Anda.
            </p>

            <div className="mb-6 rounded-xl border border-sage-200 bg-sage-50 p-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-sage-600">Petunjuk</h2>
              <ul className="space-y-2 text-sm text-sage-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                  <span>Setiap soal punya <strong>4 pernyataan</strong>. Pilih <strong>P (Paling)</strong> untuk yang paling menggambarkan diri Anda dan <strong>K (Kurang)</strong> untuk yang paling tidak menggambarkan.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                  <span>Satu pernyataan tidak bisa jadi P dan K sekaligus.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                  <span>Jawablah dengan jujur — tidak ada jawaban benar atau salah.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startTest}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-sage-600 to-sage-700 px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-sage-700 hover:to-sage-800 disabled:opacity-50"
            >
              {loading ? "Menyiapkan..." : "Mulai Tes"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sage-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-sage-400">atau</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-sage-500">Sudah selesai? Lihat hasil:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan UUID"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookupResult()}
                  className="flex-1 rounded-xl border border-sage-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                />
                <button
                  onClick={lookupResult}
                  disabled={mounted && !uuid.trim()}
                  className="rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sage-800 disabled:opacity-40"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
