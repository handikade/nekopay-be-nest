# Plan: Invoice Partner Snapshot Schema Updates (Revised)

## Objectives

Update the `Invoice` model in `prisma/schema.prisma` to include snapshot fields for partner data. This ensures that historical invoice documents maintain their original partner information even if the main `Partner` record is updated, while allowing the system to detect when a snapshot is older than the current source data.

## Prerequisites

- Existing `Partner` and `Invoice` models in `prisma/schema.prisma`.

## 1. Schema Updates (`prisma/schema.prisma`)

### Partner Snapshot Fields

Add the following fields to the `Invoice` model to store the "frozen" state of the partner at the time of invoice issuance:

- `partner_name`: `String` @db.VarChar(255)
- `partner_company_email`: `String` @db.VarChar(255)
- `partner_company_phone`: `String` @db.VarChar(20)
- `partner_address`: `String?` @db.VarChar(255)

### Metadata Fields

- `partner_snapshot_at`: `DateTime` @default(now()) @db.Timestamptz
  _(This field will be compared against `Partner.updated_at` to determine if the snapshot is potentially outdated.)_

## 2. Technical Notes

- **Data Types:** Ensure `VarChar` lengths strictly match the source fields in the `Partner` model.
- **Nullability:** `partner_address` should remain optional (`String?`) to match the `Partner` model definition.
- **Precision:** Both `Invoice.partner_snapshot_at` and `Partner.updated_at` use `@db.Timestamptz` to ensure microsecond-level precision during comparison.

## Verification Steps

1. **Schema Validation:** Run `pnpm prisma validate` to ensure the schema is syntactically correct.
2. **Field Alignment:** Manually verify that every snapshot field in `Invoice` has a corresponding field and matching type/length in the `Partner` model.
3. **Snapshot Timestamp:** Verify `partner_snapshot_at` is present and uses the correct Prisma/Postgres types.
