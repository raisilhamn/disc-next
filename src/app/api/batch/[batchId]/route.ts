import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isValidUUID, checkLookupLimit, getClientIp } from "@/lib/security"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const ip = getClientIp(request)
  const rl = await checkLookupLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    )
  }

  const { batchId } = await params
  if (!isValidUUID(batchId)) {
    return NextResponse.json({ error: "Link tidak valid" }, { status: 404 })
  }

  const batch = await prisma.testBatch.findUnique({
    where: { id: batchId },
    select: { id: true, label: true },
  })

  if (!batch) {
    return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json({ id: batch.id, label: batch.label })
}
