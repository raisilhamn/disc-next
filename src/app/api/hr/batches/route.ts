import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isNonEmptyString } from "@/lib/security"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const batches = await prisma.testBatch.findMany({
    where: { hrUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tests: true } } },
  })

  return NextResponse.json({
    batches: batches.map((b) => ({
      id: b.id,
      label: b.label,
      createdAt: b.createdAt,
      testCount: b._count.tests,
    })),
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const raw = body as Record<string, unknown>
  if (!isNonEmptyString(raw.label, 200)) {
    return NextResponse.json({ error: "Label wajib diisi" }, { status: 400 })
  }

  const batch = await prisma.testBatch.create({
    data: { label: (raw.label as string).trim(), hrUserId: session.user.id },
  })

  return NextResponse.json(
    { id: batch.id, label: batch.label, createdAt: batch.createdAt },
    { status: 201 }
  )
}
