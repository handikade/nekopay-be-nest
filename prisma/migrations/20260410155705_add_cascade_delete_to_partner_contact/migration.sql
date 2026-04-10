-- DropForeignKey
ALTER TABLE "partner_contacts" DROP CONSTRAINT "partner_contacts_partner_id_fkey";

-- AddForeignKey
ALTER TABLE "partner_contacts" ADD CONSTRAINT "partner_contacts_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
