-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "tax_type" "TaxType" NOT NULL DEFAULT 'EXCLUSIVE';
