export type DiscPattern = {
  id: number
  type: string
  name: string
  behaviour: string[]
  jobs: string[]
  description: string
}

// Pattern profiles from cahyadsn/disc_id (MIT, https://github.com/cahyadsn/disc_id), db/disc.sql tbl_patterns.
export const PATTERNS: Record<number, DiscPattern> = {
  1: {
    id: 1,
    type: "C",
    name: "LOGICAL THINKER",
    behaviour: ["Pendiam", "Anti Kritik", "Perfeksionis"],
    jobs: ["Planner (any function)", "Engineer (Installation, Technical)", "Technical/Research (Chemist Technician)"],
    description:
      "Seorang yang praktis, cakap dan unik. Ia orang yang mampu menilai diri sendiri dan kritis terhadap dirinya dan orang lain.",
  },
  2: {
    id: 2,
    type: "D",
    name: "ESTABLISHER",
    behaviour: ["Individualis", "Ego Tinggi", "Kurang Sensitif"],
    jobs: ["Attorney", "Researcher", "Sales Representative"],
    description:
      "Memiliki rasa ego yang tinggi dan cenderung invidualis dengan standard yang sangat tinggi. Ia lebih suka menganalisa masalah sendirian daripada bersama orang lain.",
  },
  3: {
    id: 3,
    type: "D / C-D",
    name: "DESIGNER",
    behaviour: ["Sensitif", "Result Oriented", "Suka Tantangan"],
    jobs: ["Engineering (Management, Research, Design)", "Research (R&D)", "Planning"],
    description:
      "Seorang yang sangat berorientasi pada tugas dan sensitif pada permasalahan. Ia lebih mempedulikan tugas yang ada dibanding orang-orang di sekitarnya, termasuk perasaan mereka.",
  },
  4: {
    id: 4,
    type: "D / I-D",
    name: "NEGOTIATOR",
    behaviour: ["Terlalu Percaya Diri", "Agresif", "Optimis"],
    jobs: ["Recruitment Consultant", "Politician", "Self-Employed"],
    description:
      "Merupakan seorang pemimpin integratif yang bekerja dengan dan melalui orang lain. Ia ramah, memiliki perhatian yang tinggi akan orang dan juga mempunyai kemampuan untuk memperoleh hormat dan penghargaan dari berbagai tipe orang. Melakukan pekerjaannya dengan cara yang bersahabat, baik dalam mencapai sasarannya maupun meyakinkan pandangannya kepada orang lain.",
  },
  5: {
    id: 5,
    type: "D / I-D-C",
    name: "CONFIDENT & DETERMINED",
    behaviour: ["Dominan", "Agresif", "Perfeksionis"],
    jobs: ["Insurance", "Mortgage and Finance Sales", "Personnel and Marketing Services"],
    description:
      "Sangat berorientasi terhadap tugas dan juga menyukai orang. Ia sangat baik dalam menarik orang/recruiting. Seorang yang bersahabat, tetapi menyukai keadaan di mana tugas-tugas harus dilakukan dengan benar. Perlu belajar untuk secara sungguh-sungguh mendengarkan orang-orang di sekitarnya dari pada selalu berpikir apa yang ingin dikatakan. Ia mempunyai kemampuan logika yang tinggi ketika ia mau menggunakannya.",
  },
  6: {
    id: 6,
    type: "D / I-D-S",
    name: "REFORMER",
    behaviour: ["Butuh Pujian & Penghargaan", "Cepat Percaya Orang", "Mudah Simpati & Empati"],
    jobs: ["Recruiting Agent", "Sales (Manager/Person)", "Marketing Services"],
    description:
      "Ia menyelesaikan tugasnya melalui keterampilan sosialnya; ia peduli dan menerima orang lain. Ia berkonsentrasi pada tugas yang ada di tangannya sampai selesai dan akan minta bantuan orang lain jika perlu. Ia menyadari keterbatasannya dan meminta bantuan jika memerlukannya. Ia disukai dan orang ingin menolongnya.",
  },
  7: {
    id: 7,
    type: "D / I-S-D",
    name: "MOTIVATOR",
    behaviour: ["Supporter", "Sosialisasi Baik", "Butuh Pujian & Penghargaan"],
    jobs: ["Hotelier", "Community Counseling", "Complaints Manager"],
    description:
      "Seorang yang menampilkan gaya bersemangat ketika termotivasi pada sasaran. Ia lebih suka memimpin atau melibatkan diri, walaupun ia juga mau melayani sebagai pembantu. Menampilkan keterampilan berhubungan dan berkomunikasi dengan sangat baik. Ia akan berusaha keras menyelesaikan tugas dengan cepat dan efisien.",
  },
  8: {
    id: 8,
    type: "D / S-D-C / S-C-D",
    name: "INQUIRER",
    behaviour: ["Result Oriented", "Kaku dan Keras Kepala", "Good Service"],
    jobs: ["Research Manager", "Scientific Work", "Accountant"],
    description:
      "Seorang yang sabar, terkontrol dan suka menggali fakta dan jalan keluar. Ia tenang dan ramah. Ia merencanakan pekerjaan dengan hati-hati, tetapi agresif, menanyakan sesuatu serta mengumpulkan data pendukung. Seorang yang konsisten dan suka menolong. People skill darinya melebihi orientasi tugasnya.",
  },
  9: {
    id: 9,
    type: "D-I",
    name: "PENGAMBIL KEPUTUSAN",
    behaviour: ["Leader", "Dingin / Task Oriented", "Argumentatif"],
    jobs: ["General Management (Directing/Managing/Supervising)", "Public Relations", "Business Management"],
    description:
      "Tidak basa-basi dan tegas, ia cenderung merupakan seorang invidualis yang kuat. Ia berpandangan jauh ke depan, progresif dan mau berkompetisi untuk mencapai sasaran. Ia juga menempatkan standard tinggi pada orang-orang di sekitarnya, serta mengutamakan kesempurnaan. Ia menginginkan otoritas yang jelas dan menyukai tugas-tugas baru.",
  },
  10: {
    id: 10,
    type: "D-I-S",
    name: "DIRECTOR",
    behaviour: ["Pengelola", "Enerjik", "Kurang Detail"],
    jobs: ["Service Manager", "Office Management", "Account Manager"],
    description:
      "Fokus pada penyelesaian pekerjaan dan menunjukkan penghargaan yang tinggi kepada orang lain. Ia memiliki kemampuan untuk menggerakkan orang dan pekerjaan dikarenakan keterampilannya berpikir ke depan dan hubungan antar manusia. Tidak berorientasi detil, ia fokus pada target secara keseluruhan dengan menyerahkan hal detil kepada orang lain. Sekali ia memutuskan sesuatu, ia akan terus mengerjakannya dan bertahan sampai selesai.",
  },
  11: {
    id: 11,
    type: "D-S",
    name: "SELF-MOTIVATED",
    behaviour: ["Objektif & Analitis", "Mandiri", "Good Planner"],
    jobs: ["Researcher", "Lawyer", "Solicitor"],
    description:
      "Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati. Secara internal termotivasi oleh target pribadi, ia berorientasi terhadap pekerjaannya tapi juga menyukai hubungan dengan sesama. Seorang yang mandiri dan cermat serta memiliki tindak lanjut yang baik.",
  },
  12: {
    id: 12,
    type: "I / C-I-S",
    name: "MEDIATOR",
    behaviour: ["Sensitif", "Good Communication Skill", "Good Analitical Think"],
    jobs: ["Public Relations", "Administration", "Office Administrator"],
    description:
      "Merupakan individu yang berorientasi pada orang, ia mampu menggabungkan ketepatan dan loyalitas. Ia cenderung peka dan mempunyai standard yang tinggi. Ia menginginkan stabilitas dan berorientasi terhadap sasaran. Ia menginginkan pengakuan sosial dan perhatian pribadi.",
  },
  13: {
    id: 13,
    type: "I / C-S-I",
    name: "PRACTITIONER",
    behaviour: ["Perfeksionis", "Quality Oriented", "Scheduled"],
    jobs: ["Chemist Research", "Computer Programmer", "Market Analyst"],
    description:
      "Bersahabat, antusias, informal, banyak bicara, dan mungkin sangat mencemaskan apa yang dipikirkan oleh orang lain. Ia menolak agresi dan mengharapkan suasana harmonis. Ia cenderung cukup cerdas dalam berbagai hal. Ia merupakan pencari fakta yang sangat baik dan akan membuat keputusan yang baik setelah mengumpulkan fakta dan data pendukung.",
  },
  14: {
    id: 14,
    type: "I-S-C / I-C-S",
    name: "RESPONSIVE & THOUGHTFUL",
    behaviour: ["High Energy", "To The Point", "Sensitif"],
    jobs: ["Actors", "Chef", "Personnel", "Welfare"],
    description:
      "Merupakan individu yang berorientasi pada orang dan lancar berkomunikasi serta loyal. Ia cenderung sensitif dan mempunyai standard yang tinggi. Keputusannya dibuat berdasarkan fakta dan data pendukung. Ia sepertinya tidak bisa diam. Ia perlu untuk lebih terus terang dan jangan terlalu subyektif.",
  },
  15: {
    id: 15,
    type: "S",
    name: "SPECIALIST",
    behaviour: ["Stabil & Konsisten", "Nyaman di Belakang Layar", "Process Oriented"],
    jobs: ["Administrative Work", "Service-General", "Landscape Gardener"],
    description:
      "Merupakan individu konsisten yang berusaha menjaga lingkungan/suasana yang tidak berubah. Ia butuh waktu untuk menyesuaikan diri dengan perubahan dan sungkan menjalankan \"cara-cara lama mengerjakan sesuatu\". Ia akan menghindari konfrontasi dan berusaha sekuat tenaga memendam perasaannya.",
  },
  16: {
    id: 16,
    type: "S / C-S",
    name: "PERFECTIONIST",
    behaviour: ["Detail & Teliti", "Sistematik & Prosedural", "Anti Kritik"],
    jobs: ["Statistician", "Surveyor", "Optician"],
    description:
      "Berpikir sistematis dan cenderung mengikuti prosedur dalam kehidupan pribadi dan pekerjaannya. Teratur dan memiliki perencanaan yang baik, ia teliti dan fokus pada detil. Bertindak dengan penuh kebijaksanaan, diplomatis dan jarang menentang rekan kerjanya dengan sengaja. Menginginkan adanya petunjuk standard pelaksanaan kerja dan tanpa perubahan mendadak.",
  },
  17: {
    id: 17,
    type: "S-C",
    name: "PEACEMAKER, RESPECTFULL & ACCURATE",
    behaviour: ["Memikirkan Dampak ke Orang Lain", "Terlalu Mendalam dalam Berpikir", "Concern ke Data dan Fakta"],
    jobs: ["Office (Manager; Supervisor; Person)", "Chief Clerk", "General Administrator"],
    description:
      "Ia peduli dengan orang-orang di sekitarnya dan mempunyai kualitas yang membuatnya sangat teliti dalam penyelesaian tugas. Jika ia merasa seseorang memanfaatkan situasi, ia akan memperlambat kerjanya sehingga dapat mengamati apa yang sedang berlangsung di sekitarnya.",
  },
  18: {
    id: 18,
    type: "D-C",
    name: "CHALLENGER",
    behaviour: ["Mempunyai keputusan yang kuat", "Kreatif dalam memecahkan masalah", "Memiliki reaksi yang cepat"],
    jobs: ["Hospital Supervisor", "Industrial Marketing", "Investment Banking"],
    description:
      "Seorang yang tekun dan memiliki reaksi yang cepat. Ia akan meneliti dan mengejar semua kemungkinan yang ada dalam mencari solusi permasalahan. Ia banyak memberikan ide-ide dengan berfokus pada pekerjaan. Usaha yang keras pada ketepatan akan mengimbangi keinginannya pada hasil yang terukur.",
  },
  19: {
    id: 19,
    type: "D-I-C",
    name: "CHANCELLOR",
    behaviour: ["Seorang yang ramah secara alami", "Menggabungkan kesenangan dengan pekerjaan", "Menyukai hubungan dengan sesama"],
    jobs: ["Finance", "Production Planning", "Personnel Disciplines"],
    description:
      "Ia menggabungkan antara kesenangan dengan pekerjaan/bisnis ketika melakukan sesuatu. Ia kelihatan menyukai hubungan dengan sesama tetapi juga dapat mengerjakan hal-hal detil. Seorang yang ramah secara alami dan menikmati interaksi dengan sesama, akan tetapi ia akan juga menilai orang dan tugas secara hati-hati; persahabatannya akan bergeser sesuai dengan dorongan hatinya pada orang lain di sekitarnya.",
  },
  20: {
    id: 20,
    type: "D-S-I",
    name: "DIRECTOR",
    behaviour: ["Ingin terlibat dalam situasi", "Ingin memberikan bantuan dan dukungan", "Termotivasi oleh target pribadi"],
    jobs: ["Engineering and Production (Directing, Managing, Supervising)", "Service Manager", "Distribution"],
    description:
      "Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati. Secara internal termotivasi oleh target pribadi, ia berorientasi terhadap pekerjaannya tapi juga menyukai hubungan dengan sesama.",
  },
  21: {
    id: 21,
    type: "D-S-C",
    name: "DIRECTOR",
    behaviour: ["Ingin terlibat dalam situasi", "Ingin memberikan bantuan dan dukungan", "Termotivasi oleh target pribadi", "Berorientasi terhadap pekerjaannya"],
    jobs: ["Office Management", "Business Consultant", "Human Resources"],
    description:
      "Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati. Secara internal termotivasi oleh target pribadi, ia berorientasi terhadap pekerjaannya tapi juga menyukai hubungan dengan sesama.",
  },
  22: {
    id: 22,
    type: "D-C-I",
    name: "CHALLENGER",
    behaviour: ["Seorang yang tekun", "Mempunyai keputusan yang kuat", "Kreatif dalam memecahkan masalah"],
    jobs: ["Technical/Scientific (Directing, Management, Supervision)", "Engineering", "Finance"],
    description:
      "Seorang yang sensitif terhadap permasalahan, dan memiliki kreativitas yang baik dalam memecahkan masalah. Ia akan meneliti dan mengejar semua kemungkinan yang ada dalam mencari solusi permasalahan. Ia banyak memberikan ide-ide dengan berfokus pada pekerjaan. Usaha yang keras pada ketepatan akan mengimbangi keinginannya pada hasil yang terukur.",
  },
  23: {
    id: 23,
    type: "D-C-S",
    name: "CHALLENGER",
    behaviour: ["Memiliki reaksi yang cepat", "Mampu mencari solusi permasalahan", "Banyak memberikan ide-ide.", "Usaha yang keras pada ketepatan"],
    jobs: ["Engineering", "Scientific", "Research Planning"],
    description:
      "Seorang yang sensitif terhadap permasalahan, dan memiliki kreativitas yang baik dalam memecahkan masalah. Ia dapat menyelesaikan tugas-tugas penting dalam waktu singkat karena mempunyai keputusan yang kuat. Seorang yang tekun dan memiliki reaksi yang cepat.",
  },
  24: {
    id: 24,
    type: "I",
    name: "COMMUNICATOR",
    behaviour: ["Persuasif", "Bicara aktif", "Inspirasional"],
    jobs: ["Promoting", "Demonstrating", "Canvassing"],
    description:
      "Merupakan seorang yang antusias dan optimistik, ia lebih suka mencapai sasarannya melalui orang lain. Ia suka berhubungan dengan sesamanya - ia bahkan suka mengadakan pesta atau kegiatan untuk berkumpul, dan ini menunjukkan kepribadiannya yang ramah. Ia tidak suka bekerja sendirian dan cenderung bersama dengan orang lain dalam menyelesaikan proyek. Perhatian dan fokusnya tidak sebaik apa yang dia inginkan - Ia lebih suka menggunakan gaya manajemen partisipatif yang dibangun berdasarkan hubungan yang kuat.",
  },
  25: {
    id: 25,
    type: "I-S",
    name: "ADVISOR",
    behaviour: ["Hangat", "Simpati", "Tenang dalam situasi sosial"],
    jobs: ["Personnel-HR", "Coach", "Mentor"],
    description:
      "Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Ia memiliki ketenangan dalam sebagian besar situasi sosial dan jarang tidak menyenangkan orang lain. Jika ia sangat kuat merasakan sesuatu, Ia akan bicara secara terbuka dan terus terang tentang pendiriannya. Ia cenderung menerima kritik atas pekerjaannya sebagai serangan pribadi..",
  },
  26: {
    id: 26,
    type: "I-C",
    name: "ASSESSOR",
    behaviour: ["Suka berteman", "Nyaman walapun dengan orang asing", "Mudah mengembangkan hubungan baru"],
    jobs: ["Training", "Inventing", "Service Engineer or Supervising within a Technical/Specialist Area"],
    description:
      "Merupakan seorang yang ramah dan suka berteman; ia merasa nyaman walaupun dengan orang asing. Ia cenderung perfeksionis secara alamiah, dan akan mengisolasi dirinya jika diperlukan untuk melaksanakan pekerjaan. Kadang-kadang ia salah menilai kemampuan orang lain dikarenakan pandangan-pandangannya yang optimis.",
  },
  27: {
    id: 27,
    type: "I-C-D",
    name: "ASSESSOR",
    behaviour: ["Analitis", "Berwatak hati-hati", "Ramah pada saat merasa nyaman"],
    jobs: ["Financial (Manager, Specialist)", "Engineering (Manager, Designer, Buyer, Draughtsman)", "Project Engineer"],
    description:
      "Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia suka berada pada situasi yang dapat diramalkan dan tidak ada kejutan. Ia sangat berorientasi pada kualitas dan akan bekerja dengan keras untuk menyelesaikan pekerjakan dengan benar. Ia ingin orang-orang berkenan akan pekerjaan yang sudah ia selesaikan dengan baik.",
  },
  28: {
    id: 28,
    type: "I-C-S",
    name: "RESPONSIVE & THOUGHTFUL",
    behaviour: ["Good Communication Skill", "To The Point", "Need Socialism", "Kurang Fokus"],
    jobs: ["Customer Services", "Public Relations", "Artist"],
    description:
      "Merupakan individu yang berorientasi pada orang dan lancar berkomunikasi serta loyal. Ia perlu untuk lebih terus terang dan jangan terlalu subyektif. Ia butuh pengakuan sosial dan perhatian pribadi; ia dapat cepat akrab dengan orang lain. Ia bersahabat, antusias, informal, banyak bicara dan terlalu khawatir terhadap apa yang dipikirkan orang.",
  },
  29: {
    id: 29,
    type: "S-D",
    name: "SELF-MOTIVATED",
    behaviour: ["Mandiri", "Good planner", "Komitmen terhadap target", "Termotivasi oleh target pribadi"],
    jobs: ["Investigator", "Researcher", "Computer Specialist"],
    description:
      "Merupakan seorang yang obyektif dan analitis. Karena determinasinya yang kuat, ia sering berhasil dalam berbagai hal; karakternya yang tenang, stabil dan daya tahannya memiliki kontribusi akan keberhasilannya. Ia bisa menjadi tidak ramah walaupun ia pada dasarnya ia yang berorientasi pada orang; dan pada situasi yang tidak membuatnya nyaman, ia lebih suka mendukung pemimpinnya dari pada keterlibatannya dengan situasi.",
  },
  30: {
    id: 30,
    type: "S-I",
    name: "ADVISOR",
    behaviour: ["Simpati dan Pengertian", "Tenang dalam situasi sosial", "Pendengar yang baik"],
    jobs: ["Hotelier", "Travel Agent", "Therapist"],
    description:
      "Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Ia memiliki ketenangan dalam sebagian besar situasi sosial dan jarang tidak menyenangkan orang lain. Ia cenderung menerima kritik atas pekerjaannya sebagai serangan pribadi. Ia merupakan \"penjaga damai\" yang sebenarnya dan akan bekerja untuk menjaga kedamaian dalam setiap keadaan.",
  },
  31: {
    id: 31,
    type: "S-D-I",
    name: "DIRECTOR",
    behaviour: ["Seorang yang obyektif dan analitis", "Termotivasi oleh target pribadi", "Berorientasi terhadap pekerjaannya"],
    jobs: ["Engineering and Production (Supervision)", "Service Selling", "Office Management"],
    description:
      "Seorang yang obyektif dan analitis. Ia ingin terlibat dalam situasi, dan ia juga ingin memberikan bantuan dan dukungan kepada orang yang ia hormati. Ulet dalam memulai pekerjaan. Ia akan berusaha keras untuk mencapai sasarannya. Seorang yang mandiri dan cermat serta memiliki tindak lanjut yang baik.",
  },
  32: {
    id: 32,
    type: "S-I-D",
    name: "ADVISOR",
    behaviour: ["Pendengar yang baik", "Demonstratif", "Tidak memaksakan idenya pada orang lain"],
    jobs: ["Engineering and Production (Supervision)", "Service Selling", "Distribution and Warehouse Supervision"],
    description:
      "Seorang yang mengesankan orang akan kehangatan, simpati dan pengertiannya. Faktanya, banyak orang datang padanya karena ia kelihatan sebagai pendengar yang baik. Ia cenderung sangat demonstratif dan emosinya biasanya tampak jelas bagi orang di sekitarnya.",
  },
  33: {
    id: 33,
    type: "S-I-C",
    name: "ADVOCATE",
    behaviour: ["Stabil", "Detail ketika situasi membutuhkan", "Teguh pendirian"],
    jobs: ["Personnel Welfare", "Technical Instructor", "Customer Service"],
    description:
      "Merupakan orang yang stabil, individu yang ramah yang berusaha keras membangun hubungan yang positif di tempat kerja dan di rumah. Ia dapat menjadi sangat berorientasi detil ketika situasi membutuhkan; tetapi secara keseluruhan ia cenderung individualis, independen dan sedikit perhatian terhadap detil. Sekali dia membuat keputusan, sangat sulit mengubah pendiriannya.",
  },
  34: {
    id: 34,
    type: "S-C-D",
    name: "INQUIRER",
    behaviour: ["Sangat berorientasi pada detil", "Sangat teliti dalam penyelesaian tugas", "Sangat berhati-hati"],
    jobs: ["Managing or Supervising (Engineering, Accountancy)", "Project Engineer", "Draughtsman"],
    description:
      "Seorang yang baik secara alamiah dan sangat berorientasi detil. Ia peduli dengan orang-orang di sekitarnya dan mempunyai kualitas yang membuatnya sangat teliti dalam penyelesaian tugas. Ia mempertimbangkan sekelilingnya dengan hati-hati sebelum membuat keputusan untuk melihat pengaruhnya pada mereka; saat tertentu ia terlalu hati-hati.",
  },
  35: {
    id: 35,
    type: "S-C-I",
    name: "ADVOCATE",
    behaviour: ["Stabil", "Ramah", "Cenderung individualis"],
    jobs: ["Personnel Welfare", "Advisers", "Attorney Counseling"],
    description:
      "Merupakan orang yang stabil, individu yang ramah yang berusaha keras membangun hubungan yang positif di tempat kerja dan di rumah. Ia ingin diterima sebagai anggota tim, dan ia menginginkan orang lain menyukainya.",
  },
  36: {
    id: 36,
    type: "C-I",
    name: "ASSESSOR",
    behaviour: ["Analitis", "Berwatak hati-hati", "Ramah pada saat merasa nyaman"],
    jobs: ["Public Relations", "Lecturer", "Personnel Administration"],
    description:
      "Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia menampilkan sikap peduli dan ramah, namun mampu memusatkan perhatian pada penyelesaian tugas yang ada.",
  },
  37: {
    id: 37,
    type: "C-D-I",
    name: "CHALLENGER",
    behaviour: ["Sangat berorientasi pada tugas", "Sensitif terhadap permasalahan", "Lebih mempedulikan tugas daripada orang"],
    jobs: ["Logistic Support", "Systems Analyst", "Lecturer"],
    description:
      "Seorang yang sangat berorientasi pada tugas dan sensitif pada permasalahan. Ia lebih mempedulikan tugas yang ada dibanding orang-orang di sekitarnya, termasuk perasaan mereka. Ia cenderung pendiam dan tidak mudah percaya.",
  },
  38: {
    id: 38,
    type: "C-D-S",
    name: "CONTEMPLATOR",
    behaviour: ["Mempunyai standar tinggi untuk dirinya", "Selalu berpikir ada ruang untuk kemajuan", "Ingin menghasilkan mutu yang terbaik"],
    jobs: ["Accountant", "Administrator", "Quality Controller"],
    description:
      "Berorientasi pada hal detil dan mempunyai standard tinggi untuk dirinya. Ia logis dan analitis. Ia ingin berbuat yang terbaik, dan ia selalu berpikir ada ruang untuk peningkatan/kemajuan.",
  },
  39: {
    id: 39,
    type: "C-I-D",
    name: "ASSESSOR",
    behaviour: ["Berwatak hati-hati", "Sangat biasa dengan orang asing", "Memusatkan perhatian pada penyelesaian tugas"],
    jobs: ["Managing or Supervising (Engineering, Research, Finance, Planning)", "Designer", "Work Study"],
    description:
      "Merupakan seseorang yang analitis, berwatak hati-hati dan ramah pada saat merasa nyaman. Ia sangat biasa dengan orang asing, karena ia dapat menilai dan menyesuaikan diri dalam hubungan mereka.",
  },
  40: {
    id: 40,
    type: "C-S-D",
    name: "PRECISIONIST",
    behaviour: ["Sistematis dan Prosedural", "Fokus pada detil", "Mengharapkan akurasi dan standard tinggi"],
    jobs: ["Engineering", "Research Director", "Production and Finance (Director, Manager, Supervisor)"],
    description:
      "Berpikir sistematis dan cenderung mengikuti prosedur dalam kehidupan pribadi dan pekerjaannya. Teratur dan memiliki perencanaan yang baik, ia teliti dan fokus pada detil. Ia bertindak dengan penuh kebijaksanaan, diplomatis dan jarang menentang rekan kerjanya dengan sengaja.",
  },
}

export const UNKNOWN_PATTERN: DiscPattern = {
  id: 0,
  type: "-",
  name: "TIDAK TERIDENTIFIKASI",
  behaviour: [],
  jobs: [],
  description: "Pola skor tidak cocok dengan profil mana pun.",
}
