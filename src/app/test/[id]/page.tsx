"use client"

import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type Option = { id: number; text: string }
type Question = { id: number; number: number; statement: string; options: Option[] }
type Answers = Record<number, { most: number | null; least: number | null }>

type StorageData = { answers: Answers; idx: number }

function saveToStorage(id: string, answers: Answers, idx: number) {
  try { sessionStorage.setItem(`disc-${id}`, JSON.stringify({ answers, idx })) } catch {}
}

function loadFromStorage(id: string): StorageData | null {
  try {
    const raw = sessionStorage.getItem(`disc-${id}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function clearStorage(id: string) {
  try { sessionStorage.removeItem(`disc-${id}`) } catch {}
}

export default function TestPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/test/${id}/questions`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setQuestions(d.questions)

        const saved = loadFromStorage(id)
        if (saved) {
          setAnswers(saved.answers)
          setCurrentIdx(saved.idx)
          return
        }

        const initial: Answers = {}
        d.questions.forEach((q: Question) => { initial[q.number] = { most: null, least: null } })
        setAnswers(initial)
      })
      .catch(() => setError("Gagal memuat soal"))
  }, [id])

  useEffect(() => {
    if (!id || Object.keys(answers).length === 0) return
    saveToStorage(id, answers, currentIdx)
  }, [id, answers, currentIdx])

  const q = questions[currentIdx]
  const a = q ? answers[q.number] : null
  const isLast = currentIdx === questions.length - 1
  const canNext = a?.most !== null && a?.least !== null
  const answered = Object.values(answers).filter((x) => x.most !== null && x.least !== null).length

  const selectP = useCallback((optionId: number) => {
    if (!q) return
    setAnswers((prev) => {
      const curr = prev[q.number]
      if (curr.least === optionId) return prev
      return { ...prev, [q.number]: { ...curr, most: optionId } }
    })
  }, [q])

  const selectK = useCallback((optionId: number) => {
    if (!q) return
    setAnswers((prev) => {
      const curr = prev[q.number]
      if (curr.most === optionId) return prev
      return { ...prev, [q.number]: { ...curr, least: optionId } }
    })
  }, [q])

  function next() {
    if (canNext && !isLast) {
      setCurrentIdx((i) => i + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function submit() {
    if (!canNext) return
    setSubmitting(true)
    const payload = Object.entries(answers).map(([num, ans]) => ({
      questionNumber: Number(num),
      optionIdM: ans.most!,
      optionIdL: ans.least!,
    }))
    try {
      const res = await fetch(`/api/test/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      })
      const data = await res.json()
      if (res.ok) {
        clearStorage(id)
        router.push(`/result/${id}`)
      } else {
        setError(data.error || "Terjadi kesalahan")
        setSubmitting(false)
      }
    } catch {
      setError("Gagal terhubung ke server")
      setSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">!</div>
          <p className="text-lg font-medium text-destructive">{error}</p>
          <button onClick={() => router.push("/")} className="mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-zinc-700">Kembali ke Beranda</button>
        </div>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat soal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-6">
      <div className="animate-slide-up">
        <div className="mb-6 overflow-hidden rounded-lg bg-zinc-900 p-5 text-white shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tes DISC 24 Soal</div>
              <div className="mt-0.5 text-lg font-bold">Soal {currentIdx + 1} dari {questions.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{answered}</div>
              <div className="text-xs text-zinc-400">Terjawab</div>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-ring transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-md border border-border bg-card px-5 py-3 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pernyataan</span>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <span className="text-disc-d">P (Paling)</span>
            <span className="text-disc-i">K (Kurang)</span>
          </div>
        </div>

        <div className="animate-fade-in rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-sm font-bold text-white shadow-sm">
              {q.number}
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Soal #{q.number}</div>
              <div className="text-sm font-medium text-foreground">Pilih P dan K</div>
            </div>
            {a?.most !== null && a?.least !== null && (
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">&#10003;</span>
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
                  className={`flex items-center gap-3 rounded-md border px-4 py-3.5 transition-colors ${
                    isP
                      ? "border-disc-d bg-blue-50"
                      : isK
                        ? "border-disc-i bg-red-50"
                        : "border-border bg-muted/30 hover:border-ring/50 hover:bg-card"
                  }`}
                >
                  <span className="flex-1 text-sm leading-snug text-foreground">{opt.text}</span>

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
                      <span className={`text-xs font-bold uppercase ${isP ? "text-disc-d" : "text-muted-foreground"}`}>P</span>
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
                      <span className={`text-xs font-bold uppercase ${isK ? "text-disc-i" : "text-muted-foreground"}`}>K</span>
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
              className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-30"
            >
              Selanjutnya &rarr;
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || !canNext}
              className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-30"
            >
              {submitting ? "Mengirim..." : "Lihat Hasil Tes"}
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          {canNext
            ? isLast ? "Semua soal sudah dijawab." : "Klik Selanjutnya untuk lanjut"
            : "Pilih P (Paling) dan K (Kurang) untuk melanjutkan"}
        </div>
      </div>
    </div>
  )
}
