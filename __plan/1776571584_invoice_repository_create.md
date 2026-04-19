# Development Plan: Invoice Repository (Create)

This plan covers the implementation of the `InvoiceRepository` focusing exclusively on the `create` operation, along with the necessary DTOs and directory structure.

## Objectives
- Establish the `invoice` module structure.
- Define Zod-based DTOs for invoice creation.
- Implement the `InvoiceRepository.create()` method using Prisma.
- Ensure the implementation follows the established patterns in the `partner` module.

## Prerequisites
- Prisma schema with `Invoice` and `InvoiceItem` models is already in place.
- `PrismaService` is available for injection.

## Proposed Changes

### 1. Directory Structure
Create the following directories:
- `src/invoice/`
- `src/invoice/dto/`

### 2. DTO Implementation (`src/invoice/dto/`)

#### A. `invoice-item-create-payload.dto.ts`
Define `InvoiceItemCreateSchema` and `InvoiceItemCreatePayloadDto`.
- Should include: `description`, `quantity`, `unit_price`, `discount_rate`, `discount_amount`, `tax_id`, `tax_rate`, `tax_type`, `tax_amount`, `line_total`.
- Use `nestjs-zod`.

#### B. `invoice-create-payload.dto.ts`
Define `InvoiceCreateSchema` and `InvoiceCreatePayloadDto`.
- Should include all mandatory fields from the `Invoice` model: `number`, `type`, `issue_date`, `due_date`, `currency`, `subtotal`, `total_tax`, `total_discount`, `grand_total`, `notes`, `user_id`, `partner_id`, `partner_name`, `partner_company_email`, `partner_company_phone`, `partner_address`.
- Should include a nested array of `items` using `InvoiceItemCreateSchema`.
- Reference `src/partner/dto/partner-create-payload.dto.ts` for structure.

#### C. `invoice-create-response.dto.ts`
Define `InvoiceCreateResponseSchema` and `InvoiceCreateResponseDto`.
- Should only contain the `id` (UUID) of the created invoice.

### 3. Repository Implementation (`src/invoice/invoice.repository.ts`)
Create `InvoiceRepository` class.
- Decorate with `@Injectable()`.
- Inject `PrismaService` in the constructor.
- Implement `create(data: InvoiceCreatePayloadDto): Promise<Invoice>`.
- Use `this.prisma.invoice.create()` with nested `items` creation:
  ```typescript
  const { items, ...invoiceData } = data;
  return this.prisma.invoice.create({
    data: {
      ...invoiceData,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });
  ```

### 4. Module Setup (`src/invoice/invoice.module.ts`)
Create `InvoiceModule` to provide and export `InvoiceRepository`.
Update `src/app.module.ts` to include `InvoiceModule`.

## Verification Plan

### 1. Automated Tests
- Create `src/invoice/invoice.repository.spec.ts`.
- Mock `PrismaService`.
- Verify that `create()` calls `prisma.invoice.create` with the correct arguments.
- Verify that the returned object matches the expected `Invoice` model.

### 2. Manual Verification
- Run `pnpm run build` to ensure no type errors.
- (Optional) If a controller is created later, verify via Swagger docs.

## References
- `prisma/schema.prisma`: `Invoice` and `InvoiceItem` models.
- `src/partner/partner.repository.ts`: For repository pattern and nested creation.
- `src/partner/dto/partner-create-payload.dto.ts`: For Zod DTO pattern.
