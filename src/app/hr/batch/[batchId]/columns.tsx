"use client"

import { type ColumnDef, type Column } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ResultRow = {
  testId: string
  name: string
  dominant: string
  createdAt: string
  diffD: number
  diffI: number
  diffS: number
  diffC: number
}

function sortableHeader<T>(label: string) {
  function SortableHeader({ column }: { column: Column<T, unknown> }) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    )
  }
  return SortableHeader
}

export const columns: ColumnDef<ResultRow>[] = [
  { accessorKey: "name", header: sortableHeader<ResultRow>("Nama") },
  { accessorKey: "dominant", header: sortableHeader<ResultRow>("Dominan") },
  {
    accessorKey: "createdAt",
    header: sortableHeader<ResultRow>("Tanggal"),
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString("id-ID"),
  },
  { accessorKey: "diffD", header: "D" },
  { accessorKey: "diffI", header: "I" },
  { accessorKey: "diffS", header: "S" },
  { accessorKey: "diffC", header: "C" },
  {
    id: "link",
    header: "Hasil",
    cell: ({ row }) => (
      <Link
        href={`/result/${row.original.testId}`}
        target="_blank"
        className="text-xs font-medium text-primary underline underline-offset-4"
      >
        Lihat
      </Link>
    ),
  },
]
