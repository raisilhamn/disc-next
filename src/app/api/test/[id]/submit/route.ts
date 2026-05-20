import { prisma } from "@/lib/prisma"
import { calculateScores, determineProfile } from "@/lib/scoring"
import { NextResponse } from "next/server"
import {
  isValidUUID,
  isValidQuestionNumber,
  isValidOptionId,
  checkRateLimit,
  sanitizeJsonBody,
} from "@/lib/security"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const rl = checkRateLimit(`submit:${ip}`, 5, 60000)
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

  if (!sanitizeJsonBody(body, 65536)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 })
  }

  const raw = body as Record<string, unknown>
  if (!Array.isArray(raw.answers) || raw.answers.length !== 24) {
    return NextResponse.json(
      { error: "All 24 questions must be answered" },
      { status: 400 }
    )
  }

  const answers = raw.answers as unknown[]
  for (const a of answers) {
    const ans = a as Record<string, unknown>
    if (
      !isValidQuestionNumber(ans.questionNumber) ||
      !isValidOptionId(ans.optionIdM) ||
      !isValidOptionId(ans.optionIdL)
    ) {
      return NextResponse.json({ error: "Invalid answer format" }, { status: 400 })
    }
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

  const typedAnswers = answers as {
    questionNumber: number
    optionIdM: number
    optionIdL: number
  }[]

  const optionIds = typedAnswers.flatMap((a) => [a.optionIdM, a.optionIdL])
  const options = await prisma.questionOption.findMany({
    where: { id: { in: optionIds } },
    include: { question: { select: { number: true } } },
  })

  const optionMap = new Map(options.map((o) => [o.id, o]))

  for (const a of typedAnswers) {
    const optM = optionMap.get(a.optionIdM)
    const optL = optionMap.get(a.optionIdL)

    if (!optM || !optL) {
      return NextResponse.json(
        { error: `Invalid option for question ${a.questionNumber}` },
        { status: 400 }
      )
    }

    if (optM.question.number !== a.questionNumber) {
      return NextResponse.json(
        { error: `Option M does not belong to question ${a.questionNumber}` },
        { status: 400 }
      )
    }

    if (optL.question.number !== a.questionNumber) {
      return NextResponse.json(
        { error: `Option L does not belong to question ${a.questionNumber}` },
        { status: 400 }
      )
    }

    if (a.optionIdM === a.optionIdL) {
      return NextResponse.json(
        { error: `Question ${a.questionNumber}: Most and Least cannot be the same` },
        { status: 400 }
      )
    }
  }

  await prisma.answer.createMany({
    data: typedAnswers.map((a) => ({
      testId: id,
      questionNumber: a.questionNumber,
      optionIdM: a.optionIdM,
      optionIdL: a.optionIdL,
    })),
  })

  const answerKeys = typedAnswers.map((a) => ({
    keyM: optionMap.get(a.optionIdM)!.keyM,
    keyL: optionMap.get(a.optionIdL)!.keyL,
  }))

  const { rawScores, calculatedScores } = calculateScores(answerKeys)
  const profile = determineProfile(calculatedScores.graph3Difference)

  await prisma.result.create({
    data: {
      testId: id,
      mD: rawScores.most.D,
      mI: rawScores.most.I,
      mS: rawScores.most.S,
      mC: rawScores.most.C,
      lD: rawScores.least.D,
      lI: rawScores.least.I,
      lS: rawScores.least.S,
      lC: rawScores.least.C,
      diffD: calculatedScores.graph3Difference.D,
      diffI: calculatedScores.graph3Difference.I,
      diffS: calculatedScores.graph3Difference.S,
      diffC: calculatedScores.graph3Difference.C,
      profile: profile.profile,
      description: profile.description,
    },
  })

  return NextResponse.json({
    testId: id,
    status: "COMPLETED",
    rawScores,
    calculatedScores,
    profile,
  })
}
