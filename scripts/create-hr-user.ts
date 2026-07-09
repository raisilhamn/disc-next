import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

async function main() {
  const email = arg("email")?.trim().toLowerCase()
  const password = arg("password")
  const name = arg("name") || email
  const role = (arg("role") || "HR").toUpperCase()

  if (!email || !password) {
    console.error(
      "Usage: tsx scripts/create-hr-user.ts --email <email> --password <password> [--name <name>] [--role HR|ADMIN]"
    )
    process.exit(1)
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters")
    process.exit(1)
  }
  if (role !== "HR" && role !== "ADMIN") {
    console.error('Role must be "HR" or "ADMIN"')
    process.exit(1)
  }

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DB_URL || "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  const prisma = new PrismaClient({ adapter })

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: name as string, role: role as "HR" | "ADMIN" },
    create: { email, passwordHash, name: name as string, role: role as "HR" | "ADMIN" },
  })

  console.log(`OK: ${user.role} account ready for ${user.email}`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
