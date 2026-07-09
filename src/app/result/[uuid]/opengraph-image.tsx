import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"
import { isValidUUID } from "@/lib/security"
import { COLORS, ORDER } from "@/lib/disc"

export const alt = "Hasil Tes DISC"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const FALLBACK_TITLE = "Tes Kepribadian DISC"
const FALLBACK_DESCRIPTION = "24 soal, hasil instan — cari tahu profil D-I-S-C kamu."

function truncate(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}

export default async function Image({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params

  let title = FALLBACK_TITLE
  let description = FALLBACK_DESCRIPTION
  let diffs: Record<string, number> | null = null

  if (isValidUUID(uuid)) {
    const test = await prisma.test.findUnique({
      where: { id: uuid },
      include: { result: true },
    })
    if (test?.result) {
      title = truncate(test.result.profile, 60)
      description = truncate(test.result.description, 140)
      diffs = {
        D: test.result.diffD,
        I: test.result.diffI,
        S: test.result.diffS,
        C: test.result.diffC,
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#18181b",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 6,
              padding: "8px 20px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#d4d4d8",
            }}
          >
            HASIL TES DISC
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#ffffff",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 26,
              lineHeight: 1.4,
              color: "#a1a1aa",
              maxWidth: 980,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20 }}>
            {ORDER.map((k) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "16px 28px",
                  border: `2px solid ${COLORS[k]}`,
                }}
              >
                <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: COLORS[k] }}>{k}</div>
                {diffs && (
                  <div style={{ display: "flex", marginTop: 6, fontSize: 20, color: "#e4e4e7" }}>
                    {`${diffs[k] > 0 ? "+" : ""}${diffs[k]}`}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: 20, color: "#71717a" }}>disc.raisilham.com</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
