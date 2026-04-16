-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('SALES', 'PURCHASE');

-- CreateEnum
CREATE TYPE "InvoiceDocStatus" AS ENUM ('DRAFT', 'POSTED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceSentStatus" AS ENUM ('SENT', 'NOT_SENT');

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "number" VARCHAR(50) NOT NULL,
    "type" "InvoiceType" NOT NULL DEFAULT 'SALES',
    "document_status" "InvoiceDocStatus" NOT NULL DEFAULT 'DRAFT',
    "sent_status" "InvoiceSentStatus" NOT NULL DEFAULT 'NOT_SENT',
    "issue_date" DATE NOT NULL,
    "due_date" DATE,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'IDR',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total_tax" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "total_discount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "grand_total" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    "user_id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL DEFAULT 1.00,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "discount_rate" DECIMAL(5,2) DEFAULT 0.00,
    "discount_amount" DECIMAL(12,2) DEFAULT 0.00,
    "tax_id" UUID,
    "tax_rate" DECIMAL(5,2) DEFAULT 0.00,
    "tax_amount" DECIMAL(12,2) DEFAULT 0.00,
    "line_total" DECIMAL(12,2) NOT NULL,
    "invoice_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_user_id_number_key" ON "invoices"("user_id", "number");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
