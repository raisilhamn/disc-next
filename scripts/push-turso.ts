import "dotenv/config"
import { createClient } from "@libsql/client"

async function push() {
  const db = createClient({
    url: process.env.TURSO_DB_URL || "file:./dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const sql = `CREATE TABLE IF NOT EXISTS "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "statement" TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS "QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "keyM" TEXT NOT NULL,
    "keyL" TEXT NOT NULL,
    FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );
  CREATE TABLE IF NOT EXISTS "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "testId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "optionIdM" INTEGER NOT NULL,
    "optionIdL" INTEGER NOT NULL,
    FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("optionIdM") REFERENCES "QuestionOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("optionIdL") REFERENCES "QuestionOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );
  CREATE TABLE IF NOT EXISTS "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mD" INTEGER NOT NULL,
    "mI" INTEGER NOT NULL,
    "mS" INTEGER NOT NULL,
    "mC" INTEGER NOT NULL,
    "lD" INTEGER NOT NULL,
    "lI" INTEGER NOT NULL,
    "lS" INTEGER NOT NULL,
    "lC" INTEGER NOT NULL,
    "diffD" INTEGER NOT NULL,
    "diffI" INTEGER NOT NULL,
    "diffS" INTEGER NOT NULL,
    "diffC" INTEGER NOT NULL,
    "profile" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'HR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS "TestBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "hrUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("hrUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "Question_number_key" ON "Question"("number");
  CREATE UNIQUE INDEX IF NOT EXISTS "Answer_testId_questionNumber_key" ON "Answer"("testId", "questionNumber");
  CREATE UNIQUE INDEX IF NOT EXISTS "Result_testId_key" ON "Result"("testId");
  CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`

  const stmts = sql.split(";").map((s) => s.trim()).filter(Boolean)
  for (const stmt of stmts) {
    await db.execute(stmt + ";")
    console.log(`OK: ${stmt.slice(0, 60)}...`)
  }

  // Columns added after the initial schema: SQLite has no "ADD COLUMN IF NOT EXISTS",
  // so these are applied individually and a "duplicate column" failure (already applied) is ignored.
  const alterStmts = [
    `ALTER TABLE "Test" ADD COLUMN "batchId" TEXT REFERENCES "TestBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "Test" ADD COLUMN "respondentName" TEXT`,
    `ALTER TABLE "Result" ADD COLUMN "primary" TEXT`,
    `ALTER TABLE "Result" ADD COLUMN "secondary" TEXT`,
    `ALTER TABLE "Result" ADD COLUMN "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  ]
  for (const stmt of alterStmts) {
    try {
      await db.execute(stmt)
      console.log(`OK: ${stmt.slice(0, 60)}...`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes("duplicate column name")) {
        console.log(`SKIP (already applied): ${stmt.slice(0, 60)}...`)
      } else {
        throw e
      }
    }
  }

  console.log("\nSchema pushed!")
}

push().catch(console.error)
