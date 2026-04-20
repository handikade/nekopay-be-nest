# Refined Plan: Create Invoice Error Response

This plan outlines the steps to improve the Swagger documentation for the `create` endpoint in the `InvoiceController` by adding standardized error response DTOs.

## Objectives
- Standardize error responses in `src/invoice/invoice.controller.ts`.
- Link Swagger documentation to the standardized error DTOs defined in `src/_core/types/error-response.type.ts`.
- Ensure consistency with other controllers (e.g., `PartnerController`, `TaxController`).

## Prerequisites
- Familiarity with NestJS `@ApiResponse` decorator.
- Understanding of the project's error response structure in `src/_core/types/error-response.type.ts`.

## Implementation Steps

### 1. Update Imports
Open `src/invoice/invoice.controller.ts` and add the following imports from `src/_core/types/error-response.type.ts`:
- `ErrorResponseDto`
- `UnauthorizedResponseDto`
- `InternalServerErrorResponseDto`

### 2. Update `create` Method Decorators
Modify the `@Post()` method decorators in `InvoiceController`:

- **Update 400 Response:** Add `type: ErrorResponseDto` to the existing 400 `@ApiResponse`.
- **Update 401 Response:** Add `type: UnauthorizedResponseDto` to the existing 401 `@ApiResponse`.
- **Add 500 Response:** Add a new `@ApiResponse` for status 500 with `description: 'Internal server error'` and `type: InternalServerErrorResponseDto`.

### 3. Proposed Code Change
```typescript
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Invoice successfully created',
    type: InvoiceCreateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: InvoiceCreatePayloadDto) {
    // ...
  }
```

## Verification Steps

### Automated Tests
- Run existing e2e tests for invoices to ensure no regressions:
  ```bash
  pnpm test:e2e test/invoice.e2e-spec.ts
  ```

### Manual Verification (Swagger)
1. Start the application in development mode:
   ```bash
   pnpm run start:dev
   ```
2. Navigate to the Swagger UI (usually `http://localhost:3000/api-docs`).
3. Locate the `POST /invoices` endpoint.
4. Verify that the "Responses" section now includes:
   - `400`: Linked to `ErrorResponseDto`.
   - `401`: Linked to `UnauthorizedResponseDto`.
   - `500`: Linked to `InternalServerErrorResponseDto`.
5. Check that the "Schemas" section correctly displays these models.
