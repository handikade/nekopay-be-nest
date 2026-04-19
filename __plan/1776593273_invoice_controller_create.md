# Invoice Controller Creation

## Objectives
Implement the `InvoiceController` to provide an API endpoint for creating invoices. The implementation must ensure proper authentication, Swagger documentation, and enforce that users can only create invoices for partners they own.

## Prerequisites
- [x] `InvoiceService.create` implemented with partner ownership validation.
- [x] `InvoiceCreatePayloadDto` and `InvoiceCreateResponseDto` available in `src/invoice/dto/`.

## API Implementation Tasks

### 1. Controller Implementation
- **File:** `src/invoice/invoice.controller.ts`
- **Class Decorators:**
  - `@ApiTags('invoices')`
  - `@UseGuards(JwtAuthGuard)`
  - `@ApiBearerAuth()`
  - `@Controller('invoices')`
- **Methods:**
  - `create(@Req() req: AuthenticatedRequest, @Body() dto: InvoiceCreatePayloadDto)`
    - **Endpoint:** `POST /invoices`
    - **Logic:**
      - Extract `userId` from `req.user.id`.
      - Inject `userId` into the `dto` (or pass it separately to the service).
      - Call `invoiceService.create(dto)`.
    - **Swagger Decorators:**
      - `@ApiResponse({ status: 201, type: InvoiceCreateResponseDto })`
      - `@ApiResponse({ status: 400, description: 'Validation Error' })`
      - `@ApiResponse({ status: 401, description: 'Unauthorized' })`
      - `@ApiResponse({ status: 404, description: 'Partner Not Found (or not owned by user)' })`

### 2. Module Registration
- **File:** `src/invoice/invoice.module.ts`
  - Add `InvoiceController` to the `controllers` array.

## Verification Plan

### Automated Tests
- **Unit Tests:**
  - Create `src/invoice/invoice.controller.spec.ts`.
  - Verify that the controller correctly calls `invoiceService.create` with the authenticated user's ID.
- **E2E Tests:**
  - Create or update `test/invoice.e2e-spec.ts`.
  - **Scenarios:**
    - [Success] Authorized user creates an invoice for their own partner.
    - [Fail] Unauthorized request (missing/invalid JWT).
    - [Fail] Authorized user attempts to create an invoice for a partner owned by another user (should return 404/403).
    - [Fail] Invalid payload (Zod validation).

### Manual Verification
- **Swagger UI:** Check `http://localhost:3000/api` to ensure the `POST /invoices` endpoint is correctly documented and grouped under "invoices".
- **Postman/REST Client:** Perform a test request using a valid JWT and verify the database record in Prisma Studio.
