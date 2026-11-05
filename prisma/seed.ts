import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DB_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

// Questions and keys from psycho.cahyadsn.com/disc_id (source: github.com/cahyadsn/disc_id, MIT).
// "*" means the option does not count toward any dimension for that column.
const questions = [
  {
    number: 1,
    options: [
      { text: "Ingin petunjuk yang jelas", keyM: "*", keyL: "C" },
      { text: "Ingin kesempatan baru", keyM: "I", keyL: "*" },
      { text: "Ingin otoritas lebih", keyM: "*", keyL: "D" },
      { text: "Menghindari konflik", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 2,
    options: [
      { text: "Memikirkan orang dahulu", keyM: "S", keyL: "S" },
      { text: "Optimis, Positif", keyM: "I", keyL: "I" },
      { text: "Kompetitif, Suka tantangan", keyM: "D", keyL: "D" },
      { text: "Pemikir logis, Sistematik", keyM: "*", keyL: "C" },
    ],
  },
  {
    number: 3,
    options: [
      { text: "Optimistik, Visioner", keyM: "D", keyL: "D" },
      { text: "Pendamai, Membawa Harmoni", keyM: "S", keyL: "S" },
      { text: "Lembut suara, Pendiam", keyM: "C", keyL: "*" },
      { text: "Pusat Perhatian, Suka gaul", keyM: "*", keyL: "I" },
    ],
  },
  {
    number: 4,
    options: [
      { text: "Saya dapatkan fakta", keyM: "C", keyL: "*" },
      { text: "Saya akan pimpin mereka", keyM: "D", keyL: "*" },
      { text: "Saya akan meyakinkan mereka", keyM: "I", keyL: "I" },
      { text: "Saya akan melaksanakan", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 5,
    options: [
      { text: "Menjadi frustrasi", keyM: "C", keyL: "C" },
      { text: "Menceritakan sisi saya", keyM: "*", keyL: "I" },
      { text: "Menyimpan perasaan saya", keyM: "S", keyL: "S" },
      { text: "Siap beroposisi", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 6,
    options: [
      { text: "Sosial, Perkumpulan kelompok", keyM: "I", keyL: "*" },
      { text: "Keselamatan, keamanan", keyM: "S", keyL: "S" },
      { text: "Pendidikan, Kebudayaan", keyM: "*", keyL: "C" },
      { text: "Prestasi, Ganjaran", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 7,
    options: [
      { text: "Aturan perlu dipertanyakan", keyM: "*", keyL: "D" },
      { text: "Aturan membuat adil", keyM: "C", keyL: "*" },
      { text: "Aturan membuat aman", keyM: "S", keyL: "S" },
      { text: "Aturan membuat bosan", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 8,
    options: [
      { text: "Kelola waktu secara efisien", keyM: "C", keyL: "*" },
      { text: "Suka selesaikan apa yang saya mulai", keyM: "S", keyL: "S" },
      { text: "Masalah sosial itu penting", keyM: "I", keyL: "I" },
      { text: "Sering terburu-buru, Merasa tertekan", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 9,
    options: [
      { text: "Rencanakan masa depan, Bersiap", keyM: "C", keyL: "*" },
      { text: "Menggunakan waktu berkualitas dgn teman", keyM: "S", keyL: "S" },
      { text: "Menerima ganjaran atas tujuan yg dicapai", keyM: "D", keyL: "D" },
      { text: "Bepergian demi petualangan baru", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 10,
    options: [
      { text: "Ramah, Mudah bergabung", keyM: "S", keyL: "*" },
      { text: "Ingin hal-hal yang pasti", keyM: "C", keyL: "C" },
      { text: "Unik, Bosan rutinitas", keyM: "*", keyL: "I" },
      { text: "Aktif mengubah sesuatu", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 11,
    options: [
      { text: "Mudah terangsang, Riang", keyM: "I", keyL: "I" },
      { text: "Tidak mudah dikalahkan", keyM: "D", keyL: "D" },
      { text: "Kerjakan sesuai perintah, Ikut pimpinan", keyM: "S", keyL: "*" },
      { text: "Ingin segalanya teratur, Rapi", keyM: "*", keyL: "C" },
    ],
  },
  {
    number: 12,
    options: [
      { text: "Akan menunggu, Tanpa tekanan", keyM: "S", keyL: "S" },
      { text: "Akan mengusahakan yang kuinginkan", keyM: "I", keyL: "*" },
      { text: "Akan membeli sesuai dorongan hati", keyM: "D", keyL: "D" },
      { text: "Akan berjalan terus tanpa kontrol diri", keyM: "*", keyL: "C" },
    ],
  },
  {
    number: 13,
    options: [
      { text: "Delegator yang baik", keyM: "D", keyL: "D" },
      { text: "Pendengar yang baik", keyM: "S", keyL: "S" },
      { text: "Penganalisa yang baik", keyM: "C", keyL: "C" },
      { text: "Penyemangat yang baik", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 14,
    options: [
      { text: "Rendah hati, Sederhana", keyM: "*", keyL: "C" },
      { text: "Terbuka memperlihatkan perasaan", keyM: "I", keyL: "*" },
      { text: "Ingin kemajuan", keyM: "D", keyL: "D" },
      { text: "Puas dengan segalanya", keyM: "S", keyL: "*" },
    ],
  },
  {
    number: 15,
    options: [
      { text: "Cenderung janji berlebihan", keyM: "I", keyL: "I" },
      { text: "Tarik diri di tengah tekanan", keyM: "*", keyL: "C" },
      { text: "Tolak perubahan mendadak", keyM: "S", keyL: "*" },
      { text: "Tidak takut bertempur", keyM: "*", keyL: "D" },
    ],
  },
  {
    number: 16,
    options: [
      { text: "Hasil adalah penting", keyM: "D", keyL: "D" },
      { text: "Mari kerjakan bersama", keyM: "*", keyL: "S" },
      { text: "Lakukan dengan benar, Akurasi penting", keyM: "C", keyL: "C" },
      { text: "Dibuat menyenangkan", keyM: "*", keyL: "I" },
    ],
  },
  {
    number: 17,
    options: [
      { text: "Garis dasar, Orientasi hasil", keyM: "D", keyL: "*" },
      { text: "Jalankan standar yang tinggi, Akurat", keyM: "C", keyL: "*" },
      { text: "Dapat diandalkan, Dapat dipercaya", keyM: "*", keyL: "S" },
      { text: "Kreatif, Unik", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 18,
    options: [
      { text: "Non-konfrontasi, Menyerah", keyM: "*", keyL: "S" },
      { text: "Perubahan pada menit terakhir", keyM: "I", keyL: "I" },
      { text: "Menuntut, Kasar", keyM: "D", keyL: "D" },
      { text: "Dipenuhi hal detail", keyM: "C", keyL: "*" },
    ],
  },
  {
    number: 19,
    options: [
      { text: "Tenang, Pendiam", keyM: "C", keyL: "C" },
      { text: "Menyenangkan, Baik hati", keyM: "S", keyL: "*" },
      { text: "Tak gentar, Berani", keyM: "D", keyL: "D" },
      { text: "Bahagia, Tanpa beban", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 20,
    options: [
      { text: "Percaya, Mudah percaya pada orang", keyM: "I", keyL: "I" },
      { text: "Petualang, Mengambil resiko", keyM: "*", keyL: "D" },
      { text: "Gampangan, Mudah setuju", keyM: "S", keyL: "S" },
      { text: "Toleran, Menghormati", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 21,
    options: [
      { text: "Memimpin, Pendekatan langsung", keyM: "D", keyL: "D" },
      { text: "Waspada, Hati-hati", keyM: "C", keyL: "*" },
      { text: "Suka bergaul, Antusias", keyM: "*", keyL: "I" },
      { text: "Dapat diramal, Konsisten", keyM: "*", keyL: "S" },
    ],
  },
  {
    number: 22,
    options: [
      { text: "Berusaha sempurna", keyM: "*", keyL: "C" },
      { text: "Ingin membuat tujuan", keyM: "D", keyL: "*" },
      { text: "Bagian dari kelompok", keyM: "*", keyL: "S" },
      { text: "Menyemangati orang", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 23,
    options: [
      { text: "Berani, Tak gentar", keyM: "D", keyL: "D" },
      { text: "Menyenangkan orang, Mudah setuju", keyM: "S", keyL: "S" },
      { text: "Tertawa lepas, Hidup", keyM: "*", keyL: "I" },
      { text: "Tenang, Pendiam", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 24,
    options: [
      { text: "Hidup, Suka bicara", keyM: "I", keyL: "*" },
      { text: "Usaha mengikuti aturan", keyM: "*", keyL: "C" },
      { text: "Gerak cepat, Tekun", keyM: "D", keyL: "D" },
      { text: "Usaha menjaga keseimbangan", keyM: "S", keyL: "S" },
    ],
  },
]

async function main() {
  console.log("Seeding database...")
  for (const q of questions) {
    const question = await prisma.question.upsert({
      where: { number: q.number },
      create: { number: q.number, statement: `Soal ${q.number}` },
      update: {},
      include: { options: { orderBy: { id: "asc" } } },
    })

    // Update options in place so existing answers keep valid option IDs.
    for (const [i, opt] of q.options.entries()) {
      const existing = question.options[i]
      if (existing) {
        await prisma.questionOption.update({ where: { id: existing.id }, data: opt })
      } else {
        await prisma.questionOption.create({ data: { ...opt, questionId: question.id } })
      }
    }
    console.log(`  Question ${q.number} seeded`)
  }
  console.log("Seeding complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
