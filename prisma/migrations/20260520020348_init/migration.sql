-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "statement" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "keyM" TEXT NOT NULL,
    "keyL" TEXT NOT NULL,
    CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "testId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "optionIdM" INTEGER NOT NULL,
    "optionIdL" INTEGER NOT NULL,
    CONSTRAINT "Answer_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_optionIdM_fkey" FOREIGN KEY ("optionIdM") REFERENCES "QuestionOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_optionIdL_fkey" FOREIGN KEY ("optionIdL") REFERENCES "QuestionOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
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
    CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_number_key" ON "Question"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_testId_questionNumber_key" ON "Answer"("testId", "questionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Result_testId_key" ON "Result"("testId");
