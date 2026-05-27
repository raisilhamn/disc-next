"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type ResultData = {
  testId: string
  createdAt: string
  rawScores: { most: Record<string, number>; least: Record<string, number> }
  calculatedScores: {
    graph1Most: Record<string, number>
    graph2Least: Record<string, number>
    graph3Difference: Record<string, number>
  }
  profile: { profile: string; description: string }
  jobs: { title: string; jobs: string[] }[]
}

const COLORS: Record<string, string> = { D: "#3b82f6", I: "#ef4444", S: "#22c55e", C: "#a855f7" }
const LABELS: Record<string, string> = { D: "Dominance", I: "Influence", S: "Steadiness", C: "Compliance" }
const ORDER = ["D", "I", "S", "C"]

function LineGraph({ data, midline = false }: { data: Record<string, number>; midline?: boolean }) {
  const W = 280
  const H = 180
  const PAD = { top: 20, right: 16, bottom: 28, left: 30 }

  const values = ORDER.map((k) => data[k] ?? 0)
  const allPositive = values.every((v) => v >= 0)
  const maxVal = Math.max(...values.map(Math.abs), 4)

  let yBase: number
  let yScale: number
  let plotH: number

  if (midline || !allPositive) {
    plotH = H - PAD.top - PAD.bottom
    yBase = PAD.top + plotH / 2
    yScale = (plotH / 2) / maxVal
  } else {
    plotH = H - PAD.top - PAD.bottom
    yBase = PAD.top + plotH
    yScale = plotH / maxVal
  }

  const plotW = W - PAD.left - PAD.right

  function xPos(i: number) {
    return PAD.left + (i / (ORDER.length - 1)) * plotW
  }

  function yPos(v: number) {
    return yBase - v * yScale
  }

  const hasNegative = values.some((v) => v < 0)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
      <line
        x1={PAD.left}
        y1={yPos(0)}
        x2={W - PAD.right}
        y2={yPos(0)}
        stroke={midline ? "#d4d4d8" : "#e4e4e7"}
        strokeWidth={midline ? 1.5 : 1}
        strokeDasharray={midline ? "4,3" : "none"}
      />

      {midline && hasNegative && [-maxVal, maxVal].map((v) => (
        <text key={v} x={PAD.left - 6} y={yPos(v) + 4} textAnchor="end" className="text-[10px]" fill="#a1a1aa">
          {v > 0 ? `+${v}` : v}
        </text>
      ))}

      <text x={PAD.left - 6} y={yPos(0) + 4} textAnchor="end" className="text-[10px]" fill="#a1a1aa">
        {midline ? "0" : "0"}
      </text>

      {!midline && (
        <text x={PAD.left - 6} y={yPos(maxVal) + 4} textAnchor="end" className="text-[10px]" fill="#a1a1aa">
          {maxVal}
        </text>
      )}

      <polyline
        points={values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ")}
        fill="none"
        stroke="#71717a"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {values.map((v, i) => (
        <g key={ORDER[i]} className="cursor-pointer">
          <title>
            {ORDER[i]}: {v > 0 ? "+" : ""}{v}
            {LABELS[ORDER[i]] ? ` (${LABELS[ORDER[i]]})` : ""}
          </title>
          <circle cx={xPos(i)} cy={yPos(v)} r={6} fill="white" stroke={COLORS[ORDER[i]]} strokeWidth={2.5} />
          <circle cx={xPos(i)} cy={yPos(v)} r={3} fill={COLORS[ORDER[i]]} />
          <text x={xPos(i)} y={H - 4} textAnchor="middle" className="text-xs font-bold" fill={COLORS[ORDER[i]]}>
            {ORDER[i]}
          </text>
          <text x={xPos(i)} y={yPos(v) - 12} textAnchor="middle" className="text-[10px] font-bold" fill={COLORS[ORDER[i]]}>
            {v > 0 ? `+${v}` : v}
          </text>
        </g>
      ))}
    </svg>
  )
}

function GraphCard({ data, title, subtitle, midline }: { data: Record<string, number>; title: string; subtitle: string; midline?: boolean }) {
  return (
    <div className="animate-fade-in rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-1 text-sm font-semibold text-foreground">{title}</div>
      <div className="mb-2 text-xs text-muted-foreground">{subtitle}</div>
      <LineGraph data={data} midline={midline} />
      <div className="mt-3 flex justify-center gap-4">
        {ORDER.map((k) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[k] }} />
            <span className="text-[10px] font-medium text-muted-foreground">{k}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ResultPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const [data, setData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const url = `${window.location.origin}/result/${uuid}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    fetch(`/api/result/${uuid}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setData({ ...d, jobs: [] })
      })
      .catch(() => setError("Gagal memuat hasil"))
      .finally(() => setLoading(false))
  }, [uuid])

  useEffect(() => {
    async function loadJobs() {
      const { getJobRecommendations } = await import("@/lib/jobs")
      if (!data) return
      const profile = data.profile.profile
      let primary = ""
      let secondary: string | undefined
      if (profile.startsWith("PURE ")) primary = profile.charAt(5)
      else {
        const m = profile.match(/^Kombinasi\s+(\w)(\w)/)
        if (m) { primary = m[1]; secondary = m[2] }
      }
      if (primary) {
        const jobs = getJobRecommendations(primary, secondary)
        setData((prev) => (prev ? { ...prev, jobs } : prev))
      }
    }
    if (data) loadJobs()
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">!</div>
          <p className="text-lg font-medium text-destructive">{error || "Hasil tidak ditemukan"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Periksa kembali UUID Anda</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-zinc-700">Kembali ke Beranda</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="animate-slide-up">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="bg-zinc-900 p-8 text-center text-white">
            <div className="mx-auto mb-2 inline-block rounded-md bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
              Hasil Tes DISC
            </div>
            <h1 className="text-2xl font-bold">{data.profile.profile}</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400">{data.profile.description}</p>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">ID Hasil</div>
                <div className="truncate rounded-md bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
                  {data.testId}
                </div>
              </div>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                {copied ? "Tersalin!" : "Copy Link"}
              </button>
            </div>

            <div className="mb-6 grid gap-5 md:grid-cols-3">
              <GraphCard data={data.calculatedScores.graph1Most} title="Graph 1: Most" subtitle="Perilaku Publik (Mask)" />
              <GraphCard data={data.calculatedScores.graph2Least} title="Graph 2: Least" subtitle="Perilaku Asli (Core)" />
              <GraphCard data={data.calculatedScores.graph3Difference} title="Graph 3: Difference" subtitle="Perilaku Kombinasi (Mirror)" midline />
            </div>

            <div className="mb-6 overflow-hidden rounded-lg border border-border shadow-sm">
              <div className="bg-muted/50 px-5 py-3">
                <h2 className="text-sm font-semibold text-foreground">Rekapitulasi Skor</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3">Kategori</th>
                      <th className="px-5 py-3">Most</th>
                      <th className="px-5 py-3">Least</th>
                      <th className="px-5 py-3">Selisih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORDER.map((k, i) => {
                      const diff = data.calculatedScores.graph3Difference[k]
                      return (
                        <tr key={k} className={`border-b last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[k] }} />
                              <span className="font-medium" style={{ color: COLORS[k] }}>{k}</span>
                              <span className="text-muted-foreground">{LABELS[k]}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-medium text-foreground">{data.rawScores.most[k]}</td>
                          <td className="px-5 py-3 font-medium text-foreground">{data.rawScores.least[k]}</td>
                          <td className={`px-5 py-3 font-bold ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>{diff >= 0 ? "+" : ""}{diff}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {data.jobs.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-border shadow-sm">
                <div className="bg-muted/50 px-5 py-3">
                  <h2 className="text-sm font-semibold text-foreground">Rekomendasi Karir</h2>
                </div>
                <div className="p-5">
                  {data.jobs.map((cat, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.jobs.map((job, j) => (
                          <span key={j} className="rounded-md border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground">
                            {job}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:text-zinc-700">
                &larr; Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
