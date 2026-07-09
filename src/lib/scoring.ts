export interface RawScores {
  most: Record<string, number>
  least: Record<string, number>
}

export interface CalculatedScores {
  graph1Most: Record<string, number>
  graph2Least: Record<string, number>
  graph3Difference: Record<string, number>
}

export function calculateScores(
  answers: { keyM: string; keyL: string }[]
): { rawScores: RawScores; calculatedScores: CalculatedScores } {
  const most: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  const least: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }

  for (const answer of answers) {
    if (answer.keyM !== "*") most[answer.keyM]++
    if (answer.keyL !== "*") least[answer.keyL]++
  }

  const diff: Record<string, number> = {}
  for (const k of ["D", "I", "S", "C"]) {
    diff[k] = most[k] - least[k]
  }

  return {
    rawScores: { most, least },
    calculatedScores: {
      graph1Most: { ...most },
      graph2Least: { ...least },
      graph3Difference: { ...diff },
    },
  }
}

export function determineProfile(diff: Record<string, number>): {
  profile: string
  description: string
  primary: string
  secondary?: string
} {
  const sorted = Object.entries(diff).sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  const aboveMidline = sorted.filter(([, v]) => v > 0)

  const profileMap: Record<string, { name: string; desc: string }> = {
    D: { name: "Dominance (D)", desc: "Berorientasi pada hasil, kontrol, dan tantangan. Tegas, cepat mengambil keputusan, dan mandiri." },
    I: { name: "Influence (I)", desc: "Berorientasi pada hubungan interpersonal dan mempengaruhi orang lain. Antusias, komunikatif, dan optimis." },
    S: { name: "Steadiness (S)", desc: "Berorientasi pada kerja sama, ketulusan, dan stabilitas. Sabar, loyal, dan pendengar yang baik." },
    C: { name: "Compliance (C)", desc: "Berorientasi pada kualitas, akurasi, dan keahlian. Analitis, teliti, dan sistematis." },
  }

  if (aboveMidline.length === 0) {
    return {
      profile: "Balanced / Low Profile",
      description: "Tidak ada karakter yang dominan di atas garis tengah. Anda cenderung memiliki pendekatan yang seimbang dalam berbagai situasi.",
      primary: top[0],
    }
  }

  if (aboveMidline.length === 1) {
    const p = aboveMidline[0][0]
    return {
      profile: `PURE ${p} (${p})`,
      description: profileMap[p].desc,
      primary: p,
    }
  }

  const p1 = aboveMidline[0][0]
  const p2 = aboveMidline[1][0]
  const combinedKey = [p1, p2].sort().join("")

  const combinedMap: Record<string, { name: string; desc: string }> = {
    DI: { name: "The Persuader / Inspirer", desc: "Berwibawa tinggi namun pandai bersosialisasi, visioner, mampu meyakinkan orang lain." },
    ID: { name: "The Persuader / Inspirer", desc: "Berwibawa tinggi namun pandai bersosialisasi, visioner, mampu meyakinkan orang lain." },
    IS: { name: "The Counselor / Agent", desc: "Hangat, empati tinggi, suka membantu orang lain dengan cara yang damai." },
    SI: { name: "The Counselor / Agent", desc: "Hangat, empati tinggi, suka membantu orang lain dengan cara yang damai." },
    SC: { name: "The Investigator / Achiever", desc: "Metodis, bekerja berdasarkan data, sangat mandiri, teliti." },
    CS: { name: "The Investigator / Achiever", desc: "Metodis, bekerja berdasarkan data, sangat mandiri, teliti." },
    CD: { name: "The Developer / Perfectionist", desc: "Sangat menuntut standar kualitas tinggi, kritis, bekerja menggunakan data keras." },
    DC: { name: "The Developer / Perfectionist", desc: "Sangat menuntut standar kualitas tinggi, kritis, bekerja menggunakan data keras." },
  }

  const combo = combinedMap[combinedKey]
  if (combo) {
    return {
      profile: `Kombinasi ${p1}${p2} - ${combo.name}`,
      description: combo.desc,
      primary: p1,
      secondary: p2,
    }
  }

  return {
    profile: `Kombinasi ${p1}${p2}`,
    description: `${profileMap[p1].name} dan ${profileMap[p2].name} adalah gaya yang menonjol pada diri Anda.`,
    primary: p1,
    secondary: p2,
  }
}
