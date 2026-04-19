-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('FIXED', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "discount_type" "DiscountType" NOT NULL DEFAULT 'FIXED';
