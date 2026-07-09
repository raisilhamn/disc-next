"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DataTable } from "@/components/data-table"
import { columns, type ResultRow } from "./columns"
import { Button } from "@/components/ui/button"

type BatchInfo = { id: string; label: string }

export default function HrBatchRecapPage() {
  const { batchId } = useParams<{ batchId: string }>()
  const [batch, setBatch] = useState<BatchInfo | null>(null)
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/hr/batch/${batchId}/results`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setBatch(d.batch)
        setRows(d.rows)
      })
      .catch(() => setError("Gagal memuat rekap"))
      .finally(() => setLoading(false))
  }, [batchId])

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

  if (error || !batch) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-destructive">{error || "Batch tidak ditemukan"}</p>
          <Link href="/hr" className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="mb-2">
        <Link href="/hr" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          &larr; Dashboard
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{batch.label}</h1>
          <p className="text-xs text-muted-foreground">{rows.length} hasil</p>
        </div>
        <Button asChild>
          <a href={`/api/hr/batch/${batchId}/export`}>Export Excel</a>
        </Button>
      </div>

      <DataTable columns={columns} data={rows} searchPlaceholder="Cari nama..." />
    </div>
  )
}
