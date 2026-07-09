import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isValidUUID, isNonEmptyString, checkCreateLimit, getClientIp, sanitizeJsonBody } from "@/lib/security"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const ip = getClientIp(request)
  const rl = await checkCreateLimit(ip)
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

  const contentType = request.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json" }, { status: 415 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!sanitizeJsonBody(body, 4096)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 })
  }

  const raw = body as Record<string, unknown>
  if (!isNonEmptyString(raw.name, 200)) {
    return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 })
  }

  const batch = await prisma.testBatch.findUnique({ where: { id: batchId } })
  if (!batch) {
    return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 })
  }

  const test = await prisma.test.create({
    data: { batchId, respondentName: (raw.name as string).trim() },
  })

  return NextResponse.json({ id: test.id }, { status: 201 })
}
