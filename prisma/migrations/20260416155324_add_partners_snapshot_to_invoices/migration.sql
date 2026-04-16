/*
  Warnings:

  - Added the required column `partner_company_email` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partner_company_phone` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partner_name` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "partner_address" VARCHAR(255),
ADD COLUMN     "partner_company_email" VARCHAR(255) NOT NULL,
ADD COLUMN     "partner_company_phone" VARCHAR(20) NOT NULL,
ADD COLUMN     "partner_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "partner_snapshot_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
