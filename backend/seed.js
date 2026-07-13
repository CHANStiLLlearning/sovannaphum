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
  console.log('Admin user seeded: admin / admin123');

  // 2. Seed Default News Articles (if empty)
  const newsCount = await prisma.newsArticle.count();
  if (newsCount === 0) {
    await prisma.newsArticle.createMany({
      data: [
        {
          title: "Welcome to Khmer America School's New Digital Portal",
          image: "https://picsum.photos/id/1018/800/450",
          date: "10 July 2026",
          description: "We are thrilled to introduce our new school website and admin management system. Parents and students can now track announcements, news, and school activities directly through our portal."
        },
        {
          title: "Annual Science and Technology Fair 2026",
          image: "https://picsum.photos/id/1015/800/450",
          date: "05 July 2026",
          description: "Our students showcased incredible innovation and scientific projects at this year's Science Fair. Congratulations to all the winners and participants for making this event a grand success!"
        },
        {
          title: "Announcing Admissions for Academic Year 2026-2027",
          image: "https://picsum.photos/id/1060/800/450",
          date: "01 July 2026",
          description: "Registrations are now open for nursery, kindergarten, primary, and secondary school levels. Contact our admissions office or fill out the contact form to secure your child's future."
        }
      ]
    });
    console.log('Sample news articles seeded.');
  }

  // 3. Seed Default Events (if empty)
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Annual Science and Technology Fair",
          description: "Our students showcase incredible innovation and scientific projects. Join us to experience creative projects in robotics, chemistry, and environmental science.",
          location: "Phnom Penh Campus",
          date: "25 October 2026",
          image: "https://picsum.photos/id/1015/800/450"
        },
        {
          title: "SPS Sports Championship 2026",
          description: "Witness the excitement, team spirit, and outstanding athleticism of our students in football, basketball, and track events.",
          location: "Siem Reap Campus",
          date: "12 November 2026",
          image: "https://picsum.photos/id/1018/800/450"
        },
        {
          title: "Cultural Arts & Music Exhibition",
          description: "A celebration of traditional Khmer dances, musical performances, and creative art displays by our talented students.",
          location: "Head Office Main Hall",
          date: "05 December 2026",
          image: "https://picsum.photos/id/1060/800/450"
        }
      ]
    });
    console.log('Sample events seeded.');
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
