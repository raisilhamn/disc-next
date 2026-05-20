import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DB_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

const questions = [
  {
    number: 1,
    options: [
      { text: "Gampang bergaul, ramah, mudah berpikiran positif", keyM: "I", keyL: "I" },
      { text: "Penuh kepercayaan, mudah percaya pada orang lain", keyM: "S", keyL: "S" },
      { text: "Penuh tenaga, siap berwujud nyata, suka bertindak", keyM: "D", keyL: "D" },
      { text: "Tenang, damai, menghindari konflik", keyM: "*", keyL: "*" },
    ],
  },
  {
    number: 2,
    options: [
      { text: "Terbuka pada hal baru, suka tantangan, berani", keyM: "D", keyL: "D" },
      { text: "Suka menganalisis, teliti, memeriksa data", keyM: "C", keyL: "C" },
      { text: "Murah hati, suka membantu, penuh perhatian", keyM: "S", keyL: "S" },
      { text: "Menyenangkan, penuh humor, suka bercerita", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 3,
    options: [
      { text: "Suka memimpin, mengarahkan orang lain", keyM: "D", keyL: "D" },
      { text: "Suka menyemangati, memotivasi orang lain", keyM: "I", keyL: "I" },
      { text: "Mengikuti instruksi, patuh pada aturan", keyM: "C", keyL: "C" },
      { text: "Suka ketenangan, tidak suka terburu-buru", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 4,
    options: [
      { text: "Cenderung pasrah, menerima apa adanya", keyM: "S", keyL: "S" },
      { text: "Suka pamer, ingin terlihat mengesankan", keyM: "I", keyL: "I" },
      { text: "Suka mengkritik, argumentatif, mempertahankan pendapat", keyM: "D", keyL: "D" },
      { text: "Suka kerja sama, mengutamakan kebersamaan", keyM: "*", keyL: "*" },
    ],
  },
  {
    number: 5,
    options: [
      { text: "Menghormati otoritas, sopan, santun", keyM: "C", keyL: "C" },
      { text: "Pionir, suka membuka jalan baru, mandiri", keyM: "D", keyL: "D" },
      { text: "Optimis, ceria, melihat sisi baik segala hal", keyM: "I", keyL: "I" },
      { text: "Suka menolong, ramah tamah, bersahabat", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 6,
    options: [
      { text: "Lembut hati, mudah kasihan, penuh empati", keyM: "S", keyL: "S" },
      { text: "Persuasif, pandai meyakinkan orang lain", keyM: "I", keyL: "I" },
      { text: "Mandiri, tidak bergantung pada orang lain", keyM: "D", keyL: "D" },
      { text: "Logis, fokus pada fakta dan kebenaran", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 7,
    options: [
      { text: "Suka bergaul, ekspresif, suka keramaian", keyM: "I", keyL: "I" },
      { text: "Berhati-hati, waspada sebelum bertindak", keyM: "C", keyL: "C" },
      { text: "Tegas, cepat mengambil keputusan", keyM: "D", keyL: "D" },
      { text: "Sabar, mampu menahan diri, toleran", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 8,
    options: [
      { text: "Berani, tidak mudah takut, suka bersaing", keyM: "D", keyL: "D" },
      { text: "Suka menghibur, membangkitkan suasana", keyM: "I", keyL: "I" },
      { text: "Teratur, rapi, terstruktur, sistematis", keyM: "C", keyL: "C" },
      { text: "Stabil, konsisten, tidak mudah berubah pikiran", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 9,
    options: [
      { text: "Bijaksana, diplomatis, menjaga perasaan orang lain", keyM: "C", keyL: "C" },
      { text: "Akomodatif, suka menyenangkan orang lain", keyM: "S", keyL: "S" },
      { text: "Bisa meyakinkan, pandai bicara/berargumen", keyM: "I", keyL: "I" },
      { text: "Keras kepala, bersikeras pada kemauan sendiri", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 10,
    options: [
      { text: "Berani mengambil risiko, menyukai petualangan", keyM: "D", keyL: "D" },
      { text: "Suka menerima tamu, ramah, terbuka", keyM: "I", keyL: "I" },
      { text: "Suka kedamaian, tenang, rileks", keyM: "S", keyL: "S" },
      { text: "Akurat, presisi, menuntut kesempurnaan", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 11,
    options: [
      { text: "Bicara apa adanya, blak-blakan, jujur", keyM: "D", keyL: "D" },
      { text: "Suka berbicara, komunikatif, pandai bercakap-cakap", keyM: "I", keyL: "I" },
      { text: "Setia, loyal, berdedikasi tinggi", keyM: "S", keyL: "S" },
      { text: "Suka mengendalikan diri, tidak emosional", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 12,
    options: [
      { text: "Penuh gairah, bersemangat tinggi", keyM: "I", keyL: "I" },
      { text: "Berani, suka menantang bahaya atau kesulitan", keyM: "D", keyL: "D" },
      { text: "Cenderung mengalah, demi kebaikan bersama", keyM: "S", keyL: "S" },
      { text: "Suka kejelasan, detail, dan kepastian", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 13,
    options: [
      { text: "Agresif, suka menyerang, kompetitif tinggi", keyM: "D", keyL: "D" },
      { text: "Suka pesta, populer, senang bersosialisasi", keyM: "I", keyL: "I" },
      { text: "Mudah ditebak, stabil, menyukai rutinitas", keyM: "S", keyL: "S" },
      { text: "Suka menyendiri, tertutup (introvert)", keyM: "*", keyL: "*" },
    ],
  },
  {
    number: 14,
    options: [
      { text: "Berhati-hati, penuh pertimbangan, tidak ceroboh", keyM: "C", keyL: "C" },
      { text: "Bertekad bulat, teguh pendirian, tidak mudah menyerah", keyM: "D", keyL: "D" },
      { text: "Mudah diyakinkan, terbuka pada saran orang lain", keyM: "S", keyL: "S" },
      { text: "Suka memuji, memberikan apresiasi pada orang lain", keyM: "I", keyL: "I" },
    ],
  },
  {
    number: 15,
    options: [
      { text: "Suka bergaul, ramah tamah pada siapa saja", keyM: "I", keyL: "I" },
      { text: "Menyukai keteraturan, rapi dalam bekerja", keyM: "C", keyL: "C" },
      { text: "Cepat, tangkas, produktif, berorientasi hasil", keyM: "D", keyL: "D" },
      { text: "Suka kedamaian, tidak suka keributan", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 16,
    options: [
      { text: "Percaya diri, yakin akan kemampuan diri sendiri", keyM: "*", keyL: "*" },
      { text: "Simpatik, penuh kehangatan, peduli sesama", keyM: "S", keyL: "S" },
      { text: "Toleran, berlapang dada, sabar menghadapi orang", keyM: "I", keyL: "I" },
      { text: "Tegas, dominan, suka mengatur situasi", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 17,
    options: [
      { text: "Disiplin, patuh pada hukum dan standar yang ada", keyM: "C", keyL: "C" },
      { text: "Murah hati, suka membagikan apa yang dimiliki", keyM: "S", keyL: "S" },
      { text: "Animatif, penuh ekspresi, suka menghidupkan suasana", keyM: "I", keyL: "I" },
      { text: "Persisten, ulet, terus mencoba hingga berhasil", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 18,
    options: [
      { text: "Suka dikagumi, senang mendapat pujian", keyM: "I", keyL: "I" },
      { text: "Suka hal baru, variasi, tidak suka monoton", keyM: "D", keyL: "D" },
      { text: "Suka kedamaian, hidup yang seimbang", keyM: "S", keyL: "S" },
      { text: "Suka kebenaran, objektif, tidak memihak", keyM: "C", keyL: "C" },
    ],
  },
  {
    number: 19,
    options: [
      { text: "Menghargai tradisi, menghormati nilai lama", keyM: "C", keyL: "C" },
      { text: "Suka tantangan, kompetitif, ingin menang", keyM: "D", keyL: "D" },
      { text: "Antusias, penuh energi, menyebarkan kegembiraan", keyM: "I", keyL: "I" },
      { text: "Mudah puas, menerima keadaan dengan bersyukur", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 20,
    options: [
      { text: "Percaya pada masa depan, optimis tinggi", keyM: "I", keyL: "I" },
      { text: "Damai, tenang, tidak mudah terhasut", keyM: "S", keyL: "S" },
      { text: "Suka ketepatan, teliti dalam menghitung/bekerja", keyM: "C", keyL: "C" },
      { text: "Suka memimpin, mengambil alih kendali kelompok", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 21,
    options: [
      { text: "Suka mengevaluasi, kritis terhadap kesalahan", keyM: "C", keyL: "C" },
      { text: "Suka berkorban, mendahulukan kepentingan orang lain", keyM: "S", keyL: "S" },
      { text: "Suka berteman, memiliki banyak relasi", keyM: "I", keyL: "I" },
      { text: "Suka otoritas, memegang kendali kepemimpinan", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 22,
    options: [
      { text: "Suka menganalisis secara mendalam", keyM: "C", keyL: "C" },
      { text: "Penuh daya pikat, menarik perhatian orang lain", keyM: "I", keyL: "I" },
      { text: "Suka keharmonisan, menjadi penengah konflik", keyM: "S", keyL: "S" },
      { text: "Suka mengarahkan, memberikan instruksi tegas", keyM: "D", keyL: "D" },
    ],
  },
  {
    number: 23,
    options: [
      { text: "Suka bersosialisasi, tidak suka sendirian", keyM: "I", keyL: "I" },
      { text: "Suka keteraturan, metodis, langkah-demi-langkah", keyM: "C", keyL: "C" },
      { text: "Suka kemandirian, tidak mau diatur orang lain", keyM: "D", keyL: "D" },
      { text: "Suka ketenangan, menghindari perdebatan", keyM: "S", keyL: "S" },
    ],
  },
  {
    number: 24,
    options: [
      { text: "Suka berbicara di depan umum, percaya diri", keyM: "I", keyL: "I" },
      { text: "Suka ketelitian, menghindari cacat/kesalahan kerja", keyM: "C", keyL: "C" },
      { text: "Suka menolong teman yang kesusahan", keyM: "S", keyL: "S" },
      { text: "Suka bersaing, bertekad menjadi yang nomor satu", keyM: "D", keyL: "D" },
    ],
  },
]

async function main() {
  console.log("Seeding database...")
  for (const q of questions) {
    await prisma.question.create({
      data: {
        number: q.number,
        statement: `Soal ${q.number}`,
        options: { create: q.options },
      },
    })
    console.log(`  Question ${q.number} seeded`)
  }
  console.log("Seeding complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
