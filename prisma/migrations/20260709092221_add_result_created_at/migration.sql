-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
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
    "primary" TEXT,
    "secondary" TEXT,
    CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("description", "diffC", "diffD", "diffI", "diffS", "id", "lC", "lD", "lI", "lS", "mC", "mD", "mI", "mS", "primary", "profile", "secondary", "testId") SELECT "description", "diffC", "diffD", "diffI", "diffS", "id", "lC", "lD", "lI", "lS", "mC", "mD", "mI", "mS", "primary", "profile", "secondary", "testId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE UNIQUE INDEX "Result_testId_key" ON "Result"("testId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
