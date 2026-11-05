import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { analyzeProfile } from "../src/lib/scoring"

// Recomputes stored profile fields of every result from its raw tallies,
// for results scored before the current scoring algorithm.
async function main() {
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DB_URL || "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  const prisma = new PrismaClient({ adapter })

  try {
    const results = await prisma.result.findMany()
    for (const r of results) {
      const profile = analyzeProfile(
        { D: r.mD, I: r.mI, S: r.mS, C: r.mC },
        { D: r.lD, I: r.lI, S: r.lS, C: r.lC }
      )
      await prisma.result.update({
        where: { id: r.id },
        data: {
          profile: profile.change.pattern.name,
          description: profile.change.pattern.description,
          primary: profile.primary ?? null,
          secondary: profile.secondary ?? null,
        },
      })
    }
    console.log(`Backfilled ${results.length} result(s)`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
