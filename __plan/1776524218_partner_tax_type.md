# Plan: Add Tax Type to Invoice Items

## 1. Overview
This plan outlines the specific steps to add a `tax_type` column to the `invoice_items` table in the database schema.

## 2. Objective
- Add a `tax_type` column to the `InvoiceItem` model to specify the tax calculation method (Inclusive/Exclusive) at the line-item level.

## 3. Prerequisites
- The `TaxType` enum is already defined in `prisma/schema.prisma`:
  ```prisma
  enum TaxType {
    INCLUSIVE
    EXCLUSIVE
  }
  ```

## 4. Schema Modification (`prisma/schema.prisma`)

### 4.1 Update `InvoiceItem` Model
Add the `tax_type` field to the `InvoiceItem` model.
- **Field Name:** `tax_type`
- **Type:** `TaxType`
- **Default:** `@default(EXCLUSIVE)`
- **Placement:** In `model InvoiceItem`, after the `tax_rate` field.

## 5. Execution Steps
1.  **Modify Schema:** Update the `InvoiceItem` model in `prisma/schema.prisma`.
2.  **Format Schema:** Run `pnpm prisma format`.
3.  **Validate Schema:** Run `pnpm prisma validate`.

## 6. Verification
- Run `pnpm prisma validate` to ensure the schema is structurally sound.
- Manually verify that the `InvoiceItem` model now includes:
  ```prisma
  tax_type TaxType @default(EXCLUSIVE)
  ```

## 7. Scope & Constraints
- **Scope:** Strictly limited to the `invoice_items` table in the `prisma/schema.prisma` file.
- **Exclusions:**
    - Do NOT modify the `Partner` table.
    - Do NOT modify the `Invoice` table.
    - No migrations, DTO updates, or backend logic implementation.
