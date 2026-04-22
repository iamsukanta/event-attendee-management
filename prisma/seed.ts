import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedData = [
  { name: 'Mohammad Rahim Uddin',   email: 'rahim.uddin@gmail.com',       amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 2, code: '3847' },
  { name: 'Farhan Hossain',         email: 'farhan.hossain@yahoo.com',     amount: 35,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 1, code: '5219' },
  { name: 'Nusrat Jahan',           email: 'nusrat.jahan@gmail.com',       amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 3, code: '7063' },
  { name: 'Karim Abdul',            email: 'karim.abdul@hotmail.com',      amount: 15,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '4182' },
  { name: 'Tasnim Akter',           email: 'tasnim.akter@gmail.com',       amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 2, code: '9351' },
  { name: 'Shahriar Islam',         email: 'shahriar.islam@outlook.com',   amount: 50,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 4, code: '2748' },
  { name: 'Mitu Begum',             email: 'mitu.begum@gmail.com',         amount: 15,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '6530' },
  { name: 'Habibur Rahman',         email: 'habibur.rahman@gmail.com',     amount: 25,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '1894' },
  { name: 'Sabrina Sultana',        email: 'sabrina.sultana@yahoo.com',    amount: 35,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '8427' },
  { name: 'Tanvir Ahmed',           email: 'tanvir.ahmed@gmail.com',       amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '5763' },
  { name: 'Riya Chakraborty',       email: 'riya.chakraborty@gmail.com',   amount: 20,  paymentMethod: 'PayPal',        isPresent: false, quantity: 1, code: '3091' },
  { name: 'Anik Das',               email: 'anik.das@gmail.com',           amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '7415' },
  { name: 'Priya Biswas',           email: 'priya.biswas@hotmail.com',     amount: 35,  paymentMethod: 'Cash',          isPresent: false,  quantity: 3, code: '2863' },
  { name: 'Sumon Sarkar',           email: 'sumon.sarkar@gmail.com',       amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '9127' },
  { name: 'Rekha Mondal',           email: 'rekha.mondal@yahoo.com',       amount: 15,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '4509' },
  { name: 'Zahir Hossain',          email: 'zahir.hossain@gmail.com',      amount: 50,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '6284' },
  { name: 'Nasrin Khatun',          email: 'nasrin.khatun@gmail.com',      amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '1736' },
  { name: 'Imtiaz Ahmed',           email: 'imtiaz.ahmed@outlook.com',     amount: 35,  paymentMethod: 'Bank Transfer', isPresent: false, quantity: 2, code: '8052' },
  { name: 'Moriam Begum',           email: 'moriam.begum@gmail.com',       amount: 20,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '3618' },
  { name: 'Rafiqul Islam',          email: 'rafiqul.islam@gmail.com',      amount: 25,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '7294' },
  { name: 'Shanta Roy',             email: 'shanta.roy@yahoo.com',         amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '5041' },
  { name: 'Mahbubur Rahman',        email: 'mahbubur.rahman@gmail.com',    amount: 50,  paymentMethod: 'Bank Transfer', isPresent: false, quantity: 3, code: '2987' },
  { name: 'Lina Akter',             email: 'lina.akter@gmail.com',         amount: 15,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '6173' },
  { name: 'Selim Reza',             email: 'selim.reza@hotmail.com',       amount: 25,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '4850' },
  { name: 'Parveen Sultana',        email: 'parveen.sultana@gmail.com',    amount: 35,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '9326' },
  { name: 'Belal Hossain',          email: 'belal.hossain@gmail.com',      amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '1547' },
  { name: 'Champa Devi',            email: 'champa.devi@yahoo.com',        amount: 20,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '7802' },
  { name: 'Jahangir Alam',          email: 'jahangir.alam@gmail.com',      amount: 25,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '3469' },
  { name: 'Tania Khatun',           email: 'tania.khatun@gmail.com',       amount: 35,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '5918' },
  { name: 'Nurul Islam',            email: 'nurul.islam@outlook.com',      amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 4, code: '2345' },
  { name: 'Asha Rani',              email: 'asha.rani@gmail.com',          amount: 15,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '8764' },
  { name: 'Mizan Mia',              email: 'mizan.mia@gmail.com',          amount: 50,  paymentMethod: 'PayPal',        isPresent: false, quantity: 2, code: '4031' },
  { name: 'Fatema Begum',           email: 'fatema.begum@yahoo.com',       amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '6729' },
  { name: 'Sazzad Hossain',         email: 'sazzad.hossain@gmail.com',     amount: 35,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '1258' },
  { name: 'Kohinoor Akter',         email: 'kohinoor.akter@gmail.com',     amount: 20,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '9473' },
  { name: 'Abdur Rahim',            email: 'abdur.rahim@hotmail.com',      amount: 25,  paymentMethod: 'PayPal',        isPresent: false, quantity: 3, code: '3682' },
  { name: 'Shilpi Rani',            email: 'shilpi.rani@gmail.com',        amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '5107' },
  { name: 'Mamunur Rashid',         email: 'mamunur.rashid@gmail.com',     amount: 50,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '7946' },
  { name: 'Nasima Begum',           email: 'nasima.begum@yahoo.com',       amount: 15,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '2513' },
  { name: 'Arif Billah',            email: 'arif.billah@gmail.com',        amount: 35,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '8390' },
  { name: 'Reshma Khatun',          email: 'reshma.khatun@gmail.com',      amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '4675' },
  { name: 'Alamgir Hossain',        email: 'alamgir.hossain@outlook.com',  amount: 25,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 2, code: '1029' },
  { name: 'Dipti Rani',             email: 'dipti.rani@gmail.com',         amount: 20,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '7384' },
  { name: 'Shaiful Islam',          email: 'shaiful.islam@gmail.com',      amount: 35,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '3956' },
  { name: 'Monowara Begum',         email: 'monowara.begum@yahoo.com',     amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '6142' },
  { name: 'Babul Hasan',            email: 'babul.hasan@gmail.com',        amount: 50,  paymentMethod: 'Bank Transfer', isPresent: false, quantity: 3, code: '9807' },
  { name: 'Sadia Islam',            email: 'sadia.islam@gmail.com',        amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '2461' },
  { name: 'Robiul Hasan',           email: 'robiul.hasan@hotmail.com',     amount: 15,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '5738' },
  { name: 'Amena Khatun',           email: 'amena.khatun@gmail.com',       amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '1903' },
  { name: 'Mizanur Rahman',         email: 'mizanur.rahman@gmail.com',     amount: 35,  paymentMethod: 'Bank Transfer', isPresent: false, quantity: 2, code: '8265' },
  { name: 'Farhana Akter',          email: 'farhana.akter@yahoo.com',      amount: 25,  paymentMethod: 'Cash',          isPresent: false,  quantity: 1, code: '4719' },
  { name: 'Khorshed Alam',          email: 'khorshed.alam@gmail.com',      amount: 20,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 2, code: '6083' },
  { name: 'Bilkis Begum',           email: 'bilkis.begum@gmail.com',       amount: 25,  paymentMethod: 'Cash',          isPresent: false, quantity: 1, code: '3527' },
  { name: 'Nazmul Huda',            email: 'nazmul.huda@outlook.com',      amount: 50,  paymentMethod: 'Bank Transfer', isPresent: false,  quantity: 4, code: '9148' },
  { name: 'Ayesha Siddika',         email: 'ayesha.siddika@gmail.com',     amount: 35,  paymentMethod: 'Cash',          isPresent: false,  quantity: 2, code: '2690' },
  { name: 'Shafiqul Hasan',         email: 'shafiqul.hasan@gmail.com',     amount: 25,  paymentMethod: 'PayPal',        isPresent: false,  quantity: 1, code: '7531' },
]

async function main() {
  const existing = await prisma.attendee.count()
  if (existing > 0) {
    console.log(`Database already has ${existing} records — skipping seed.`)
    return
  }

  console.log('Seeding 55 attendees…')

  await prisma.attendee.createMany({
    data: seedData.map((row, i) => ({
      ...row,
      attendeeNo: i + 1,
    })),
  })

  console.log(`✅ Seeded ${seedData.length} attendees.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
