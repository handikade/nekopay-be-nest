import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'npx ts-node ./prisma/seed-tax.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
