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

  return NextResponse.json({ batch: { id: batch.id, label: batch.label }, rows })
}
