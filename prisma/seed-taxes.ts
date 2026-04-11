import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient, TaxType } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

// Create the connection pool
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

// Use TaxCreateInput so you don't have to provide id, created_at, or updated_at
const taxes: Prisma.TaxCreateInput[] = [
  {
    code: 'PPH21_25_GROSS_UP',
    rate: new Prisma.Decimal(0.025),
    type: TaxType.EXCLUSIVE,
    name: 'PPH 21 2,5% Gross Up',
  },
  {
    code: 'PPH21_3_GROSS_UP',
    rate: new Prisma.Decimal(0.03),
    type: TaxType.EXCLUSIVE,
    name: 'PPH 21 3% Gross Up',
  },
  {
    code: 'PPH23_NPWP_2',
    rate: new Prisma.Decimal(0.02),
    type: TaxType.EXCLUSIVE,
    name: 'PPH 23 NPWP 2%',
  },
  {
    code: 'PPH21_NPWP_2_5',
    rate: new Prisma.Decimal(0.025),
    type: TaxType.EXCLUSIVE,
    name: 'PPH 21 NPWP 2,5%',
  },
  {
    code: 'PPH23_NON_NPWP_4',
    rate: new Prisma.Decimal(0.04),
    type: TaxType.EXCLUSIVE,
    name: 'PPH 23 Non NPWP 4%',
  },
  {
    code: 'PPN_1_1_EXCLUSIVE',
    rate: new Prisma.Decimal(0.011),
    type: TaxType.EXCLUSIVE,
    name: 'PPN 1,1% Exclusive',
  },
  {
    code: 'PPN_1_1_INCLUSIVE',
    rate: new Prisma.Decimal(0.011),
    type: TaxType.INCLUSIVE,
    name: 'PPN 1,1% Inclusive',
  },
  {
    code: 'PPN_1_EXCLUSIVE',
    rate: new Prisma.Decimal(0.01),
    type: TaxType.EXCLUSIVE,
    name: 'PPN 1% Exclusive',
  },
  {
    code: 'PPN_1_INCLUSIVE',
    rate: new Prisma.Decimal(0.01),
    type: TaxType.INCLUSIVE,
    name: 'PPN 1% Inclusive',
  },
  {
    code: 'PPN_10_EXCLUSIVE',
    rate: new Prisma.Decimal(0.1),
    type: TaxType.EXCLUSIVE,
    name: 'PPN 10% Exclusive',
  },
  {
    code: 'PPN_10_INCLUSIVE',
    rate: new Prisma.Decimal(0.1),
    type: TaxType.INCLUSIVE,
    name: 'PPN 10% Inclusive',
  },
  {
    code: 'PPN_11_EXCLUSIVE',
    rate: new Prisma.Decimal(0.11),
    type: TaxType.EXCLUSIVE,
    name: 'PPN 11% Exclusive',
  },
  {
    code: 'PPN_11_INCLUSIVE',
    rate: new Prisma.Decimal(0.11),
    type: TaxType.INCLUSIVE,
    name: 'PPN 11% Inclusive',
  },
  {
    code: 'PPN_12_EXCLUSIVE',
    rate: new Prisma.Decimal(0.12),
    type: TaxType.EXCLUSIVE,
    name: 'PPN 12% Exclusive',
  },
  {
    code: 'PPN_12_INCLUSIVE',
    rate: new Prisma.Decimal(0.12),
    type: TaxType.INCLUSIVE,
    name: 'PPN 12% Inclusive',
  },
];

async function main() {
  console.log('🚀 starting tax seed process...');
  console.log({ connectionString });

  for (const tax of taxes) {
    try {
      await prisma.tax.upsert({
        where: { code: tax.code },
        update: {
          rate: tax.rate,
          type: tax.type,
          name: tax.name,
        },
        create: {
          code: tax.code,
          rate: tax.rate,
          type: tax.type,
          name: tax.name,
        },
      });
      console.log(`💳 seeded tax: ${tax.code}`);
    } catch (error) {
      console.error(`❌ error seeding tax ${tax.code}:`, error);
    }
  }

  console.log('🏁 seeding finished successfully.');
}

main()
  .catch((e: unknown) => {
    console.error('💥 fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
