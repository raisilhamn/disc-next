import { prisma } from "@/lib/prisma"
import { getRedis } from "@/lib/redis"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const redis = getRedis()
  if (redis) {
    const cached = await redis.get<number>("stats:total")
    if (cached !== null) {
      return NextResponse.json({ total: cached })
    }
  }

  const total = await prisma.test.count({
    where: { result: { isNot: null } },
  })

  if (redis) {
    await redis.set("stats:total", total, { ex: 300 })
  }

  return NextResponse.json({ total })
}
