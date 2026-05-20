import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const total = await prisma.test.count({
    where: { result: { isNot: null } },
  })
  return NextResponse.json({ total })
}
