# Refined Plan: Update Invoice Flow

This plan outlines the implementation of the "Update Invoice" flow in the `src/invoice` module. The goal is to allow users to edit existing invoices that are still in `DRAFT` status.

## Objectives
- Implement `PATCH /invoices/:id` endpoint for updating invoices.
- Support partial updates of invoice header and full replacement of invoice items.
- Ensure only the owner of the invoice can update it.
- Restrict updates to invoices with `DRAFT` status.
- Automatically recalculate subtotals, taxes, discounts, and grand totals upon update.

## Implementation Steps

### 1. DTO Implementation
- **File**: `src/invoice/dto/invoice-update-payload.dto.ts`
- **Task**: Create `InvoiceUpdateSchema` using `InvoiceCreateSchema.partial()`.
  - Exclude `user_id` from the updateable fields (managed by controller).
  - Ensure `items` can be optionally provided for replacement.
  - Export `InvoiceUpdatePayloadDto` using `createZodDto`.

### 2. Repository Enhancements
- **File**: `src/invoice/invoice.repository.ts`
- **Task**: Add the following methods:
  - `findById(id: string): Promise<(Invoice & { items: InvoiceItem[] }) | null>`: Fetch invoice with its items.
  - `update(id: string, data: any): Promise<Invoice>`: Perform a transaction to update the invoice header and handle items.
    - If `items` are provided, delete existing items and create new ones.
    - Handle `partner_name`, `partner_company_email`, etc., if they are passed as part of the update.

### 3. Service Logic
- **File**: `src/invoice/invoice.service.ts`
- **Task**: Implement `update(id: string, user_id: string, data: InvoiceUpdatePayloadDto)`:
  - Fetch existing invoice using `repository.findById(id)`.
  - Throw `NotFoundException` if it doesn't exist or doesn't belong to the `user_id`.
  - Throw `BadRequestException` if `document_status` is not `DRAFT`.
  - If `partner_id` is changed:
    - Validate new partner ownership.
    - Update snapshots (`partner_name`, etc.).
  - If `items` are changed (or if related fields like taxes/discounts change):
    - Recalculate line totals, `subtotal`, `total_tax`, `total_discount`, and `grand_total` using existing logic (extract common recalculation logic if possible).
  - Call `repository.update(id, updatedData)`.

### 4. Controller Endpoint
- **File**: `src/invoice/invoice.controller.ts`
- **Task**: Add `PATCH /:id` endpoint:
  - Use `JwtAuthGuard` and `@ApiBearerAuth()`.
  - Inject `user.id` from `req.user`.
  - Call `invoiceService.update(id, user_id, dto)`.
  - Add Swagger documentation (`@ApiResponse`) for 200, 400, 401, 403, 404.

## Verification Steps

### Automated Tests
1. **Unit Tests**:
   - Update `src/invoice/invoice.service.spec.ts` to test authorization and status constraints.
   - Update `src/invoice/invoice.repository.spec.ts` to test the transactional update logic.
2. **E2E Tests**:
   - Add test cases in `test/invoice.e2e-spec.ts` for successful update and various failure scenarios (wrong owner, not DRAFT, invalid partner).

### Manual Verification
1. **Swagger UI**:
   - Verify that the `PATCH /invoices/{id}` endpoint is visible and correctly documented.
   - Test with valid and invalid payloads.
2. **Database Check**:
   - Confirm that invoice items are correctly replaced and totals are accurately updated in the database.
