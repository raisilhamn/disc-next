import { prisma } from "@/lib/prisma"
import { isValidUUID } from "@/lib/security"

export async function getOwnedBatch(batchId: string, hrUserId: string) {
  if (!isValidUUID(batchId)) return null
  const batch = await prisma.testBatch.findUnique({ where: { id: batchId } })
  if (!batch || batch.hrUserId !== hrUserId) return null
  return batch
}

export async function getBatchResultRows(batchId: string) {
  const tests = await prisma.test.findMany({
    where: { batchId, result: { isNot: null } },
    include: { result: true },
    orderBy: { createdAt: "desc" },
  })

  return tests.map((t) => ({
    testId: t.id,
    name: t.respondentName || "(Tanpa nama)",
    dominant: [t.result!.primary, t.result!.secondary].filter(Boolean).join(""),
    createdAt: t.result!.createdAt,
    diffD: t.result!.diffD,
    diffI: t.result!.diffI,
    diffS: t.result!.diffS,
    diffC: t.result!.diffC,
  }))
}
