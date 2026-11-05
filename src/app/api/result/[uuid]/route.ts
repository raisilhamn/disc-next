import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { isValidUUID, checkLookupLimit, getClientIp } from "@/lib/security"
import { analyzeProfile } from "@/lib/scoring"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const ip = getClientIp(request)
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

  const r = test.result
  const most = { D: r.mD, I: r.mI, S: r.mS, C: r.mC }
  const least = { D: r.lD, I: r.lI, S: r.lS, C: r.lC }

  return NextResponse.json({
    testId: test.id,
    createdAt: test.createdAt,
    status: "COMPLETED",
    rawScores: { most, least },
    calculatedScores: {
      graph1Most: most,
      graph2Least: least,
      graph3Difference: { D: r.diffD, I: r.diffI, S: r.diffS, C: r.diffC },
    },
    profile: analyzeProfile(most, least),
  })
}
