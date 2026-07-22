import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getUTCDate(daysOffset: number = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysOffset);
  const yyyy = d.getFullYear();
  const mm = d.getMonth();
  const dd = d.getDate();
  return new Date(Date.UTC(yyyy, mm, dd, 12, 0, 0));
}

const seedData = [
  // Today's records (0 days offset)
  // Madhya Pradesh - Indore
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Wheat", minPrice: 2600, maxPrice: 2950, modalPrice: 2800, offset: 0 },
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Soybean", minPrice: 4300, maxPrice: 4750, modalPrice: 4550, offset: 0 },
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Gram", minPrice: 5400, maxPrice: 5850, modalPrice: 5600, offset: 0 },
  
  // Madhya Pradesh - Bhopal
  { state: "Madhya Pradesh", district: "Bhopal", mandi: "Bhopal", crop: "Wheat", minPrice: 2550, maxPrice: 2850, modalPrice: 2720, offset: 0 },
  { state: "Madhya Pradesh", district: "Bhopal", mandi: "Bhopal", crop: "Garlic", minPrice: 8000, maxPrice: 14000, modalPrice: 11000, offset: 0 },
  
  // Madhya Pradesh - Dhar
  { state: "Madhya Pradesh", district: "Dhar", mandi: "Dhamnod", crop: "Cotton", minPrice: 6800, maxPrice: 7400, modalPrice: 7150, offset: 0 },
  { state: "Madhya Pradesh", district: "Dhar", mandi: "Dhamnod", crop: "Soybean", minPrice: 4250, maxPrice: 4650, modalPrice: 4480, offset: 0 },
  { state: "Madhya Pradesh", district: "Dhar", mandi: "Dhar", crop: "Onion", minPrice: 1200, maxPrice: 1800, modalPrice: 1500, offset: 0 },

  // Madhya Pradesh - Hoshangabad / Narmadapuram (Pipariya)
  { state: "Madhya Pradesh", district: "Narmadapuram", mandi: "Pipariya", crop: "Paddy", minPrice: 2200, maxPrice: 2650, modalPrice: 2450, offset: 0 },
  { state: "Madhya Pradesh", district: "Narmadapuram", mandi: "Pipariya", crop: "Wheat", minPrice: 2500, maxPrice: 2800, modalPrice: 2680, offset: 0 },

  // Madhya Pradesh - Ujjain
  { state: "Madhya Pradesh", district: "Ujjain", mandi: "Ujjain", crop: "Wheat", minPrice: 2620, maxPrice: 2900, modalPrice: 2780, offset: 0 },
  { state: "Madhya Pradesh", district: "Ujjain", mandi: "Ujjain", crop: "Soybean", minPrice: 4350, maxPrice: 4700, modalPrice: 4520, offset: 0 },

  // Maharashtra
  { state: "Maharashtra", district: "Pune", mandi: "Pune APMC", crop: "Onion", minPrice: 1400, maxPrice: 1900, modalPrice: 1650, offset: 0 },
  { state: "Maharashtra", district: "Pune", mandi: "Pune APMC", crop: "Tomato", minPrice: 1800, maxPrice: 2600, modalPrice: 2200, offset: 0 },
  { state: "Maharashtra", district: "Nashik", mandi: "Lasalgaon", crop: "Onion", minPrice: 1500, maxPrice: 2100, modalPrice: 1800, offset: 0 },

  // Uttar Pradesh
  { state: "Uttar Pradesh", district: "Agra", mandi: "Agra Mandi", crop: "Potato", minPrice: 950, maxPrice: 1350, modalPrice: 1150, offset: 0 },
  { state: "Uttar Pradesh", district: "Agra", mandi: "Agra Mandi", crop: "Wheat", minPrice: 2400, maxPrice: 2700, modalPrice: 2550, offset: 0 },

  // Haryana
  { state: "Haryana", district: "Ambala", mandi: "Ambala APMC", crop: "Wheat", minPrice: 2450, maxPrice: 2750, modalPrice: 2600, offset: 0 },
  { state: "Haryana", district: "Ambala", mandi: "Ambala APMC", crop: "Paddy", minPrice: 2300, maxPrice: 2800, modalPrice: 2550, offset: 0 },

  // --- Historical records for trend calculations (2 days ago offset = 2) ---
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Wheat", minPrice: 2550, maxPrice: 2900, modalPrice: 2720, offset: 2 },
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Soybean", minPrice: 4400, maxPrice: 4800, modalPrice: 4620, offset: 2 },
  { state: "Madhya Pradesh", district: "Indore", mandi: "Indore", crop: "Gram", minPrice: 5350, maxPrice: 5800, modalPrice: 5550, offset: 2 },
  { state: "Maharashtra", district: "Pune", mandi: "Pune APMC", crop: "Onion", minPrice: 1350, maxPrice: 1800, modalPrice: 1580, offset: 2 },
  { state: "Maharashtra", district: "Nashik", mandi: "Lasalgaon", crop: "Onion", minPrice: 1600, maxPrice: 2200, modalPrice: 1900, offset: 2 },
];

async function main() {
  console.log("Seeding Mandi Price data into database...");
  
  // Clean existing records if any
  await prisma.mandiPrice.deleteMany();

  for (const item of seedData) {
    await prisma.mandiPrice.create({
      data: {
        state: item.state,
        district: item.district,
        mandi: item.mandi,
        crop: item.crop,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
        modalPrice: item.modalPrice,
        date: getUTCDate(item.offset),
        source: "manual_verified",
      },
    });
  }

  const count = await prisma.mandiPrice.count();
  console.log(`Successfully seeded ${count} MandiPrice records!`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
