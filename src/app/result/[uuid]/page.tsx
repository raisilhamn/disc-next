import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { isValidUUID } from "@/lib/security"
import ResultClient from "./ResultClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>
}): Promise<Metadata> {
  const { uuid } = await params
  if (!isValidUUID(uuid)) return {}

  const test = await prisma.test.findUnique({
    where: { id: uuid },
    include: { result: true },
  })
  if (!test?.result) return {}

  const title = `${test.result.profile} — Hasil Tes DISC`
  const description = test.result.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function ResultPage() {
  return <ResultClient />
}
