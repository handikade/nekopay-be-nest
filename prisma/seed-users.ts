import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create the connection pool and adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Define raw user data (without hashed passwords yet)
const rawUsers: Prisma.UserCreateInput[] = [
  {
    email: 'admin@nekopay.id',
    username: 'admin',
    password: 'admin1234',
    role: 'admin',
  },
  {
    email: 'dika@nekopay.id',
    username: 'dika',
    password: 'neko1234',
  },
];

async function main() {
  console.log('🚀 Starting seed process...');

  const hashedUsers = await Promise.all(
    rawUsers.map(async (user) => {
      const hashedPassword = await argon2.hash(user.password);

      return {
        ...user,
        password: hashedPassword,
      };
    }),
  );

  for (const userData of hashedUsers) {
    try {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          username: userData.username,
          email: userData.email,
          role: userData.role,
        },
        create: {
          email: userData.email,
          username: userData.username,
          password: userData.password,
          role: userData.role,
        },
      });
      console.log(`👤 Seeded user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error seeding user ${userData.email}:`, error);
    }
  }

  console.log('🏁 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('💥 Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Important: Close the PG pool connection
  });
