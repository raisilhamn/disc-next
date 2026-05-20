"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Option = { id: number; text: string }
type Question = { id: number; number: number; statement: string; options: Option[] }

export default function TestPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { most: number | null; least: number | null }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/test/${id}/questions`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setQuestions(d.questions)
        const initial: Record<number, { most: number | null; least: number | null }> = {}
        d.questions.forEach((q: Question) => { initial[q.number] = { most: null, least: null } })
        setAnswers(initial)
      })
  }, [id])

  const q = questions[currentIdx]
  const a = q ? answers[q.number] : null
  const isLast = currentIdx === questions.length - 1
  const canNext = a?.most !== null && a?.least !== null
  const answered = Object.values(answers).filter((x) => x.most !== null && x.least !== null).length

  function selectP(optionId: number) {
    if (!q) return
    setAnswers((prev) => {
      const curr = prev[q.number]
      if (curr.least === optionId) return prev
      return { ...prev, [q.number]: { ...curr, most: optionId } }
    })
  }

  function selectK(optionId: number) {
    if (!q) return
    setAnswers((prev) => {
      const curr = prev[q.number]
      if (curr.most === optionId) return prev
      return { ...prev, [q.number]: { ...curr, least: optionId } }
    })
  }

  function next() {
    if (canNext && !isLast) {
      setCurrentIdx((i) => i + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function submit() {
    setSubmitting(true)
    const payload = Object.entries(answers).map(([num, ans]) => ({
      questionNumber: Number(num),
      optionIdM: ans.most!,
      optionIdL: ans.least!,
    }))
    const res = await fetch(`/api/test/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push(`/result/${id}`)
    } else {
      setError(data.error || "Terjadi kesalahan")
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white/80 p-8 text-center shadow-lg backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">⚠</div>
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button onClick={() => router.push("/")} className="mt-4 text-blue-600 underline underline-offset-2 hover:text-blue-800">Kembali ke Beranda</button>
        </div>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sage-500 border-t-transparent" />
          <p className="text-sm text-sage-400">Memuat soal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <div className="animate-slide-up">
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 p-5 text-white shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Tes DISC 24 Soal</div>
              <div className="mt-0.5 text-lg font-bold">Soal {currentIdx + 1} dari {questions.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{answered}</div>
              <div className="text-xs text-white/70">Terjawab</div>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-sage-200 bg-white/70 px-5 py-3 shadow-sm backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">Pernyataan</span>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <span className="text-[#3b6ea5]">P (Paling)</span>
            <span className="text-[#b15555]">K (Kurang)</span>
          </div>
        </div>

        <div className="animate-fade-in rounded-2xl border border-sage-200 bg-white p-5 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sage-500 to-sage-700 text-sm font-bold text-white shadow">
              {q.number}
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-sage-400">Soal #{q.number}</div>
              <div className="text-sm font-medium text-sage-600">Pilih P dan K</div>
            </div>
            {a?.most !== null && a?.least !== null && (
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">✓</span>
            )}
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt) => {
              const isP = a?.most === opt.id
              const isK = a?.least === opt.id
              const pDisabled = a?.least === opt.id
              const kDisabled = a?.most === opt.id

              return (
                <div
                  key={opt.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                    isP
                      ? "border-[#3b6ea5] bg-[#f0f5ff] shadow-sm"
                      : isK
                        ? "border-[#b15555] bg-[#fdf0f0] shadow-sm"
                        : "border-sage-100 bg-sage-50/50 hover:border-sage-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <span className="flex-1 text-sm leading-snug">{opt.text}</span>

                  <div className="flex items-center gap-4">
                    <label className={`flex cursor-pointer items-center gap-1.5 ${pDisabled ? "cursor-not-allowed opacity-25" : ""}`}>
                      <input
                        type="radio"
                        name={`p-${q.number}`}
                        data-p
                        checked={isP}
                        onChange={() => selectP(opt.id)}
                        disabled={pDisabled}
                      />
                      <span className={`text-xs font-bold uppercase ${isP ? "text-[#3b6ea5]" : "text-sage-300"}`}>P</span>
                    </label>

                    <label className={`flex cursor-pointer items-center gap-1.5 ${kDisabled ? "cursor-not-allowed opacity-25" : ""}`}>
                      <input
                        type="radio"
                        name={`k-${q.number}`}
                        data-k
                        checked={isK}
                        onChange={() => selectK(opt.id)}
                        disabled={kDisabled}
                      />
                      <span className={`text-xs font-bold uppercase ${isK ? "text-[#b15555]" : "text-sage-300"}`}>K</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          {!isLast ? (
            <button
              onClick={next}
              disabled={!canNext}
              className="rounded-xl bg-gradient-to-r from-sage-600 to-sage-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-sage-700 hover:to-sage-800 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
            >
              Selanjutnya →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-sage-600 to-sage-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-sage-700 hover:to-sage-800 disabled:scale-100 disabled:opacity-30 disabled:shadow-none"
            >
              {submitting ? "Mengirim..." : "Lihat Hasil Tes"}
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-sage-400">
          {canNext
            ? isLast ? "Semua soal sudah dijawab." : "Klik Selanjutnya untuk lanjut"
            : "Pilih P (Paling) dan K (Kurang) untuk melanjutkan"}
        </div>
      </div>
    </div>
  )
}
