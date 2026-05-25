import { prisma } from "@/lib/prisma"
import { getRedis } from "@/lib/redis"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const redis = getRedis()
  if (redis) {
    try {
      const cached = await redis.get<number>("stats:total")
      if (cached !== null) {
        return NextResponse.json({ total: cached })
      }
    } catch {
      const total = await prisma.test.count({
        where: { result: { isNot: null } },
      })
      return NextResponse.json({ total })
    }
  }

  const total = await prisma.test.count({
    where: { result: { isNot: null } },
  })

  if (redis) {
    try {
      await redis.set("stats:total", total)
    } catch {}
  }

  return NextResponse.json({ total })
}
