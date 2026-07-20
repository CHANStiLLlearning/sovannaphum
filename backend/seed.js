const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin Account
  const password = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: password
    }
  });
  // console.log('Admin user seeded: admin / admin123');

  // 2. Seed Default Settings
  const defaultSettings = [
    { key: 'about_hero_image', value: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920' },
    { key: 'about_hero_title', value: 'About Us' },
    { key: 'about_mission_title', value: 'Our Mission' },
    { key: 'about_mission_desc', value: 'To provide our students with the highest quality of education, combining international academic standards with rich Cambodian cultural values. We aim to nurture young minds to become innovative thinkers and responsible global citizens.' },
    { key: 'about_vision_title', value: 'Our Vision' },
    { key: 'about_vision_desc', value: 'To be the leading educational institution in Cambodia that is recognized internationally for academic excellence, character development, and equipping students with the essential skills to thrive in the 21st century.' }
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
