# Invoice Service Creation Flow

## Objectives
Implement the `InvoiceService` to handle the business logic for creating invoices. This includes calculating item-level and invoice-level totals, discounts, and taxes, as well as capturing a point-in-time snapshot of partner information.

## Prerequisites
- [x] Schema updated in `prisma/schema.prisma` with `DiscountType` enum and `invoice_items.discount_type` column.
- [ ] `calculateTaxAmount` utility is available in `src/_core/utils/calculate-tax.util.ts`.

## Implementation Tasks

### 1. DTO Updates
- **File:** `src/invoice/dto/invoice-item-create-payload.dto.ts`
  - Add `discount_type` to `InvoiceItemCreateSchema` as an enum: `['FIXED', 'PERCENTAGE']`.
  - Ensure `discount_type` defaults to `FIXED`.

### 2. Service Implementation
- **File:** `src/invoice/invoice.service.ts`
  - Create `InvoiceService` class.
  - **Inject Dependencies:**
    - `InvoiceRepository` (for database persistence)
    - `PartnerRepository` (to fetch partner snapshot data)
    - `TaxRepository` (to fetch tax rates/types for items)
  - **Implement `create(userId: string, data: InvoiceCreateInput)` method:**
    - **Partner Snapshot:** Fetch partner by `id` using `PartnerRepository.findById`. Throw `NotFoundException` if not found. Map partner fields (`name`, `company_email`, `company_phone`, `address`) to the invoice snapshot fields.
    - **Item Calculations:** Loop through each item in `data.items`:
      - If `tax_id` is provided, fetch tax details from `TaxRepository.findById`.
      - Calculate `discount_amount`:
        - If `discount_type === 'PERCENTAGE'`, calculate based on `(quantity * unit_price) * (discount_rate / 100)`.
        - If `discount_type === 'FIXED'`, use the provided `discount_amount` (or `discount_rate` if mapped differently).
      - Calculate `tax_amount` using `calculateTaxAmount` util. Use the item's `unit_price * quantity - discount_amount` as the `baseAmount`.
      - Calculate `line_total` = `(quantity * unit_price) - discount_amount + tax_amount` (Note: adjust based on whether tax is inclusive/exclusive).
    - **Invoice Calculations:**
      - Sum up `subtotal` (sum of `quantity * unit_price`).
      - Sum up `total_discount`, `total_tax`, and `grand_total`.
    - **Persist:** Call `InvoiceRepository.create()` with the fully populated data.

### 3. Module Registration
- **File:** `src/invoice/invoice.module.ts`
  - Import `PartnerModule` and `TaxModule`.
  - Add `InvoiceService` to `providers` and `exports`.

### 4. Repository Enhancement (Optional/If needed)
- Ensure `InvoiceRepository.create` properly handles the nested `items` creation (already seems to be implemented).

## Verification Plan

### Unit Tests
- Create `src/invoice/invoice.service.spec.ts`.
- **Test Cases:**
  - Successfully create an invoice with multiple items (mixed tax and discounts).
  - Verify `discount_amount` calculation for `PERCENTAGE` type.
  - Verify `tax_amount` calculation for `INCLUSIVE` vs `EXCLUSIVE` taxes using the utility.
  - Verify partner snapshot data matches the fetched partner.
  - Throw error when partner is not found.
  - Throw error when tax is not found (if `tax_id` provided).

### Manual Verification
- Once the controller is implemented (separate task), verify via Swagger/Postman that the calculated fields in the response match expected values.
