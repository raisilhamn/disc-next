import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isValidUUID, checkRateLimit } from "@/lib/security"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const rl = checkRateLimit(`questions:${ip}`, 30, 60000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    )
  }

  const { id } = await params

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid test ID" }, { status: 400 })
  }

  const test = await prisma.test.findUnique({
    where: { id },
    include: { answers: true },
  })

  if (!test) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 })
  }

  if (test.answers.length > 0) {
    return NextResponse.json({ error: "Test already submitted" }, { status: 400 })
  }

  const questions = await prisma.question.findMany({
    orderBy: { number: "asc" },
    include: {
      options: {
        select: { id: true, text: true },
      },
    },
  })

  return NextResponse.json({ testId: id, questions })
}
