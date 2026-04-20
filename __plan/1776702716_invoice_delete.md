# Development Plan: Invoice Deletion and Cancellation

## Objectives
- Implement **soft deletion** for invoices in `DRAFT` status.
- Implement **cancellation** for invoices in `POSTED` or `PAID` status.
- Ensure strict ownership validation (user can only delete/cancel their own invoices).
- Maintain consistency with existing project patterns (e.g., `Partner` soft-delete implementation).

## Prerequisites
- Prisma schema already includes `deleted_at` and `document_status` in the `Invoice` model.
- `InvoiceRepository` and `InvoiceService` are already scaffolded with CRUD operations.

## Technical Implementation

### 1. Repository Layer (`src/invoice/invoice.repository.ts`)
- [x] **Update `findById(id: string)`**:
  - Modify the `where` clause to include `deleted_at: null` to ensure soft-deleted records are ignored by default.
- [x] **Implement `softDelete(id: string)`**:
  - Add a method to set `deleted_at: new Date()` for the specified record.
- [x] **Implement `updateStatus(id: string, status: InvoiceDocStatus)`**:
  - Add a method to update the `document_status` (specifically for transition to `CANCELLED`).

### 2. Service Layer (`src/invoice/invoice.service.ts`)
- [x] **Implement `remove(id: string, userId: string)`**:
  - Retrieve the invoice via `findById(id, userId)`.
  - Validate that `document_status` is exactly `DRAFT`.
  - Throw `BadRequestException` if status is not `DRAFT`.
  - Call `invoiceRepository.softDelete(id)`.
- [x] **Implement `cancel(id: string, userId: string)`**:
  - Retrieve the invoice via `findById(id, userId)`.
  - Validate that `document_status` is either `POSTED` or `PAID`.
  - Throw `BadRequestException` if status is `DRAFT` (direct them to delete) or `CANCELLED`.
  - Call `invoiceRepository.updateStatus(id, 'CANCELLED')`.

### 3. Controller Layer (`src/invoice/invoice.controller.ts`)
- [x] **Add `DELETE /invoices/:id`**:
  - Use `@Delete(':id')` decorator.
  - Call `invoiceService.remove(id, req.user.id)`.
  - Return `200 OK` with the deleted invoice data (standard response pattern).
- [x] **Add `PATCH /invoices/:id/cancel`**:
  - Use `@Patch(':id/cancel')` decorator.
  - Call `invoiceService.cancel(id, req.user.id)`.
  - Return `200 OK` with the updated invoice data.
- [x] **Swagger Documentation**:
  - Add `@ApiResponse decorators for success (200), validation errors (400), unauthorized (401), and not found (404).

## Verification & Validation

### Unit Testing
- [x] **Service Tests (`src/invoice/invoice.service.spec.ts`)**:
  - Verify `remove` succeeds for `DRAFT` and fails for other statuses.
  - Verify `cancel` succeeds for `POSTED`/`PAID` and fails for `DRAFT`/`CANCELLED`.
  - Verify ownership checks throw `NotFoundException` for invoices belonging to other users.
- [x] **Repository Tests (`src/invoice/invoice.repository.spec.ts`)**:
  - Verify `findById` excludes records where `deleted_at` is not null.
  - Verify `softDelete` correctly sets the timestamp.

### E2E Testing (`test/invoice.e2e-spec.ts`)
- [x] **Deletion Flow**:
  - Create DRAFT -> Delete -> Verify 404 on GET.
- [x] **Cancellation Flow**:
  - Create DRAFT -> (Simulate) Status update to POSTED -> Cancel -> Verify status is `CANCELLED`.
- [x] **Security**:
  - Attempt to delete/cancel another user's invoice -> Verify 404/Forbidden.

### Manual Verification
- [x] Run `pnpm run start:dev` and verify endpoints via Swagger UI (`/api`).
