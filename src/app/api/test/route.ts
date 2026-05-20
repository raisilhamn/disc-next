import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { checkCreateLimit } from "@/lib/security"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const rl = await checkCreateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    )
  }

  const test = await prisma.test.create({ data: {} })
  return NextResponse.json({ id: test.id }, { status: 201 })
}
