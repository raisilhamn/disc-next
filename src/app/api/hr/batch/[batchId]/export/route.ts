import ExcelJS from "exceljs"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getOwnedBatch, getBatchResultRows } from "@/lib/hr"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { batchId } = await params
  const batch = await getOwnedBatch(batchId, session.user.id)
  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const rows = await getBatchResultRows(batchId)
  const origin = new URL(request.url).origin

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Rekap")

  sheet.columns = [
    { header: "Nama", key: "name", width: 28 },
    { header: "Dominan", key: "dominant", width: 12 },
    { header: "Tanggal", key: "createdAt", width: 20 },
    { header: "D", key: "diffD", width: 8 },
    { header: "I", key: "diffI", width: 8 },
    { header: "S", key: "diffS", width: 8 },
    { header: "C", key: "diffC", width: 8 },
    { header: "Link Hasil", key: "link", width: 40 },
  ]
  sheet.getRow(1).font = { bold: true }

  for (const row of rows) {
    sheet.addRow({
      name: row.name,
      dominant: row.dominant,
      createdAt: new Date(row.createdAt).toLocaleString("id-ID"),
      diffD: row.diffD,
      diffI: row.diffI,
      diffS: row.diffS,
      diffC: row.diffC,
      link: { text: "Lihat Hasil", hyperlink: `${origin}/result/${row.testId}` },
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `rekap-${batch.label.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "batch"}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
