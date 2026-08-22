require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // 1. Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.local' },
    update: {},
    create: {
      email: 'demo@globetrotter.local',
      password: hashedPassword,
    },
  });
  console.log('Demo user created:', user.email);

  // 2. Create Cities
  const citiesData = [
    { name: 'Tokyo', country: 'Japan', description: 'Bustling capital blending ultramodern and traditional.' },
    { name: 'Kyoto', country: 'Japan', description: 'Heart of traditional Japan with thousands of classical Buddhist temples.' },
    { name: 'Osaka', country: 'Japan', description: 'Famous for modern architecture, nightlife and hearty street food.' },
    { name: 'Paris', country: 'France', description: 'Global center for art, fashion, gastronomy and culture.' },
    { name: 'London', country: 'UK', description: 'History meets modern culture along the Thames.' },
    { name: 'New York', country: 'USA', description: 'The city that never sleeps.' }
  ];

  await prisma.city.deleteMany({});
  await prisma.activity.deleteMany({});

  const createdCities = {};
  for (const c of citiesData) {
    createdCities[c.name] = await prisma.city.create({ data: c });
  }
  console.log('Cities created');

  // 3. Create Activities
  const activitiesData = [
    { name: 'Tokyo Tower', category: 'attraction', duration: 120, estimatedCost: 2000, cityId: createdCities['Tokyo'].id },
    { name: 'Tsukiji Fish Market', category: 'food', duration: 180, estimatedCost: 3500, cityId: createdCities['Tokyo'].id },
    { name: 'Meiji Shrine', category: 'culture', duration: 90, estimatedCost: 0, cityId: createdCities['Tokyo'].id },

    { name: 'Fushimi Inari Taisha', category: 'culture', duration: 180, estimatedCost: 0, cityId: createdCities['Kyoto'].id },
    { name: 'Kinkaku-ji (Golden Pavilion)', category: 'culture', duration: 60, estimatedCost: 500, cityId: createdCities['Kyoto'].id },

    { name: 'Dotonbori Street Food', category: 'food', duration: 120, estimatedCost: 4000, cityId: createdCities['Osaka'].id },
    { name: 'Osaka Castle', category: 'attraction', duration: 120, estimatedCost: 600, cityId: createdCities['Osaka'].id },

    { name: 'Eiffel Tower', category: 'attraction', duration: 180, estimatedCost: 30, cityId: createdCities['Paris'].id },
    { name: 'Louvre Museum', category: 'culture', duration: 240, estimatedCost: 17, cityId: createdCities['Paris'].id },

    { name: 'British Museum', category: 'culture', duration: 240, estimatedCost: 0, cityId: createdCities['London'].id },
    { name: 'London Eye', category: 'attraction', duration: 60, estimatedCost: 35, cityId: createdCities['London'].id },

    { name: 'Central Park', category: 'attraction', duration: 120, estimatedCost: 0, cityId: createdCities['New York'].id },
    { name: 'Broadway Show', category: 'entertainment', duration: 180, estimatedCost: 120, cityId: createdCities['New York'].id },
  ];

  for (const a of activitiesData) {
    await prisma.activity.create({ data: a });
  }
  console.log('Activities created');

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
