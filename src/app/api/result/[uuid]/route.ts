import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isValidUUID, checkLookupLimit } from "@/lib/security"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const rl = await checkLookupLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    )
  }

  const { uuid } = await params

  if (!isValidUUID(uuid)) {
    return NextResponse.json({ error: "Invalid UUID" }, { status: 400 })
  }

  const test = await prisma.test.findUnique({
    where: { id: uuid },
    include: { result: true },
  })

  if (!test) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  if (!test.result) {
    return NextResponse.json({ error: "Test not completed yet" }, { status: 400 })
  }

  return NextResponse.json({
    testId: test.id,
    createdAt: test.createdAt,
    status: "COMPLETED",
    rawScores: {
      most: { D: test.result.mD, I: test.result.mI, S: test.result.mS, C: test.result.mC },
      least: { D: test.result.lD, I: test.result.lI, S: test.result.lS, C: test.result.lC },
    },
    calculatedScores: {
      graph1Most: { D: test.result.mD, I: test.result.mI, S: test.result.mS, C: test.result.mC },
      graph2Least: { D: test.result.lD, I: test.result.lI, S: test.result.lS, C: test.result.lC },
      graph3Difference: { D: test.result.diffD, I: test.result.diffI, S: test.result.diffS, C: test.result.diffC },
    },
    profile: {
      profile: test.result.profile,
      description: test.result.description,
    },
  })
}
