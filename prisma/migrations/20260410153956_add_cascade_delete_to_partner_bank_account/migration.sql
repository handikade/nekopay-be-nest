-- DropForeignKey
ALTER TABLE "partner_bank_accounts" DROP CONSTRAINT "partner_bank_accounts_partner_id_fkey";

-- AddForeignKey
ALTER TABLE "partner_bank_accounts" ADD CONSTRAINT "partner_bank_accounts_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
