# Refined Plan: View Invoice Detail

This plan outlines the implementation of the "View Invoice Detail" flow in the `src/invoice` module. The goal is to allow users to retrieve the full details of a specific invoice, including its items, with proper authorization.

## Objectives
- Implement `GET /invoices/:id` endpoint.
- Ensure only the owner of the invoice can view its details.
- Provide a standardized response format including all invoice fields and nested items.
- Maintain consistency with other modules (e.g., `PartnerModule`).

## Implementation Steps

### 1. DTO Implementation
Create a new file `src/invoice/dto/invoice.dto.ts` to define the response schemas and DTOs:

- **`InvoiceItemResponseSchema`**: Represents the `InvoiceItem` model in responses.
  - Fields from `InvoiceItemCreateSchema` + `id`, `created_at`, `updated_at`.
- **`InvoiceResponseSchema`**: Represents the `Invoice` model in responses.
  - Fields from `InvoiceCreateSchema` + `id`, `document_status`, `sent_status`, `created_at`, `updated_at`.
  - Nested: `items` (array of `InvoiceItemResponseSchema`).
- **`InvoiceSingleResponseDto`**: The wrapped response DTO for Swagger.
  - Use `makeResponseDto(makeResponseSchema(InvoiceResponseSchema))`.

### 2. Service Logic
Update `src/invoice/invoice.service.ts`:
- **Method**: `findById(id: string, userId: string)`
  - Call `this.invoiceRepository.findById(id)`.
  - Throw `NotFoundException` if the invoice does not exist or if `invoice.user_id !== userId`.
  - Return the invoice with its nested items.

### 3. Controller Endpoint
Update `src/invoice/invoice.controller.ts`:
- **Endpoint**: `GET /invoices/:id`
- **Method**: `findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest)`
  - Use `JwtAuthGuard` and `@ApiBearerAuth()`.
  - Extract `userId` from `req.user.id`.
  - Call `invoiceService.findById(id, userId)`.
  - Add Swagger decorators:
    - `@ApiResponse({ status: 200, type: InvoiceSingleResponseDto })`
    - `@ApiResponse({ status: 401, type: UnauthorizedResponseDto })`
    - `@ApiResponse({ status: 404, type: ErrorResponseDto, description: 'Invoice not found' })`

## Verification Steps

### Automated Tests
1. **Unit Tests**:
   - Update `src/invoice/invoice.service.spec.ts` to test `findById`:
     - Successful retrieval of own invoice.
     - `NotFoundException` for non-existent invoice.
     - `NotFoundException` (or `ForbiddenException`) for an invoice owned by another user.
2. **E2E Tests**:
   - Add test cases in `test/invoice.e2e-spec.ts`:
     - `GET /invoices/:id` - Success.
     - `GET /invoices/:id` - Unauthorized (401).
     - `GET /invoices/:id` - Not Found (404) for other user's invoice.

### Manual Verification
1. **Swagger UI**:
   - Verify that the `GET /invoices/{id}` endpoint is correctly documented.
   - Test the endpoint with a valid invoice ID and verify the response structure.
2. **Standard Compliance**:
   - Ensure all date fields are ISO strings and numeric fields are correctly formatted.
