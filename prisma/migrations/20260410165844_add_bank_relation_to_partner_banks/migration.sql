/*
  Warnings:

  - You are about to drop the column `bank_code` on the `partner_bank_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `bank_name` on the `partner_bank_accounts` table. All the data in the column will be lost.
  - Added the required column `bank_id` to the `partner_bank_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partner_bank_accounts" DROP COLUMN "bank_code",
DROP COLUMN "bank_name",
ADD COLUMN     "bank_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "partner_bank_accounts" ADD CONSTRAINT "partner_bank_accounts_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
