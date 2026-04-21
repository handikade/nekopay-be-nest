# Invoice Next Number Implementation Plan

This plan outlines the steps to implement an endpoint that retrieves the next available invoice number for an authenticated user, following the project's NestJS architecture.

## Objectives
- Provide a `GET /invoices/next-number` endpoint.
- Retrieve the latest invoice number for the current user and increment it using the existing `incrementDocNumber` utility.
- Ensure proper authorization and user ownership.

## Technical Details
- **Base Endpoint:** `/invoices`
- **Method:** `GET /next-number`
- **Utility:** `src/_core/utils/increment-doc-number.util.ts`
- **Response Format:** `{ statusCode: 200, message: "Success", data: { next_number: "INV-002" } }`

## Implementation Steps

### 1. Data Transfer Objects (DTO)
- [x] Create `src/invoice/dto/invoice-next-number-response.dto.ts`:
  - Define `InvoiceNextNumberSchema` using Zod: `z.object({ next_number: z.string() })`.
  - Create `InvoiceNextNumberResponseDto` using `makeResponseDto(makeResponseSchema(InvoiceNextNumberSchema))`.

### 2. Repository Layer
- [x] Update `src/invoice/invoice.repository.ts`:
  - Add `async findLatestNumber(userId: string): Promise<string | null>`.
  - Logic: Query `prisma.invoice.findFirst` where `user_id` matches, ordered by `created_at` DESC, selecting only the `number` field.

### 3. Service Layer
- [x] Update `src/invoice/invoice.service.ts`:
  - Add `async getNextNumber(userId: string): Promise<{ next_number: string }>`.
  - Logic:
    1. Call `invoiceRepository.findLatestNumber(userId)`.
    2. Import `incrementDocNumber` from `src/_core/utils/increment-doc-number.util.ts`.
    3. Return `{ next_number: incrementDocNumber(latestNumber || '') }`.

### 4. Controller Layer
- [x] Update `src/invoice/invoice.controller.ts`:
  - Add `@Get('next-number')` endpoint.
  - Decorate with `@ApiResponse` for 200 (Success) using `InvoiceNextNumberResponseDto`.
  - Implement `async getNextNumber(@Req() req: AuthenticatedRequest)`:
    - Call `this.invoiceService.getNextNumber(req.user.id)`.

## Validation & Testing

### Unit Testing
- [x] **Repository:** Update `src/invoice/invoice.repository.spec.ts` to test `findLatestNumber`.
- [x] **Service:** Update `src/invoice/invoice.service.spec.ts` to test `getNextNumber` (mocking the repository).
- [x] **Controller:** Update `src/invoice/invoice.controller.spec.ts` to test the `GET /next-number` route.

### E2E Testing
- [x] Update `test/invoice.e2e-spec.ts`:
  - Add a test case to verify `GET /invoices/next-number` returns the correct incremented value based on existing data for the user.

### Swagger Documentation
- [x] Verify that the new endpoint is correctly documented in Swagger UI (`/api/docs`).
