interface JobCategory {
  profile: string
  title: string
  description: string
  jobs: string[]
}

const jobDatabase: JobCategory[] = [
  {
    profile: "PURE D",
    title: "PURE D - The Director / Producer",
    description: "Berorientasi pada hasil akhir, menyukai kekuasaan, tantangan tinggi, kompetitif.",
    jobs: [
      "Chief Executive Officer (CEO) / Direktur Perusahaan",
      "Entrepreneur / Founder",
      "Sales Manager",
      "Operations Manager",
      "Project Manager (Crisis/Turnaround)",
    ],
  },
  {
    profile: "DI",
    title: "DI / ID - The Persuader / Inspirer",
    description: "Berwibawa tinggi, pandai bersosialisasi, visioner, mampu meyakinkan orang lain.",
    jobs: [
      "Business Development Manager",
      "Corporate Attorney / Pengacara",
      "Public Relations Director",
      "Investment Banker",
    ],
  },
  {
    profile: "PURE I",
    title: "PURE I - The Promoter / Socializer",
    description: "Sangat antusias, persuasif, ramah, mengutamakan hubungan interpersonal.",
    jobs: [
      "Marketing Communication Specialist",
      "Event Organizer / Wedding Planner",
      "Travel Agent / Tour Guide",
      "Talent Acquisition / Recruiter",
      "Broadcaster / Podcaster / Influencer",
    ],
  },
  {
    profile: "IS",
    title: "IS / SI - The Counselor / Agent",
    description: "Hangat, empati tinggi, suka membantu orang lain dengan cara yang damai.",
    jobs: [
      "Human Resources (HR) Generalist",
      "Psychologist / Counselor",
      "Customer Success Manager",
      "Teacher / Educator",
    ],
  },
  {
    profile: "PURE S",
    title: "PURE S - The Specialist / Technician",
    description: "Konsisten, loyal, menyukai rutinitas, bekerja dengan tenang di balik layar.",
    jobs: [
      "Administrative Assistant / Sekretaris",
      "Customer Service Representative",
      "Data Entry Clerk",
      "Librarian / Arsiparis",
      "Social Worker / Pekerja Sosial",
    ],
  },
  {
    profile: "SC",
    title: "SC / CS - The Investigator / Achiever",
    description: "Metodis, bekerja berdasarkan data, sangat mandiri, teliti.",
    jobs: [
      "Research Analyst",
      "Technical Writer",
      "Accountant / Auditor Internal",
      "Database Administrator",
    ],
  },
  {
    profile: "PURE C",
    title: "PURE C - Compliance",
    description: "Praktis, sangat analitis, teliti, sistematis, standar kualitas tinggi.",
    jobs: [
      "Planner (Setiap fungsi perencanaan)",
      "Engineer (Bagian Instalasi / Teknis)",
      "Technical / Research (Chemist Technician)",
      "Academic (Dosen / Peneliti)",
      "Statistician (Ahli Statistik / Data Analyst)",
      "Government Worker (Pegawai Pemerintahan)",
      "IT Management",
      "Prison Officer",
      "Quality Controller (QC / QA Engineer)",
    ],
  },
  {
    profile: "CD",
    title: "CD / DC - The Developer / Perfectionist",
    description: "Sangat menuntut standar kualitas tinggi, kritis, tegas dalam menegakkan aturan kerja.",
    jobs: [
      "Software Architect / Senior Software Engineer",
      "Risk Assessment Manager",
      "Financial Controller",
      "Legal Auditor / Compliance Officer",
    ],
  },
]

export function getJobRecommendations(primary: string, secondary?: string): JobCategory[] {
  const combined = [primary, secondary].filter(Boolean).sort().join("")
  const results: JobCategory[] = []

  const pureKey = `PURE ${primary}`
  const pureMatch = jobDatabase.find((j) => j.profile === pureKey)
  if (pureMatch) results.push(pureMatch)

  if (secondary) {
    const comboMatch = jobDatabase.find((j) => j.profile === combined)
    if (comboMatch && !results.includes(comboMatch)) results.push(comboMatch)
  }

  if (results.length === 0) {
    const fallback = jobDatabase.find((j) => j.profile === pureKey)
    if (fallback) results.push(fallback)
  }

  return results
}
