# Create Partner Flow Improvement

## Objectives
Optimize the partner creation API to align with the project's "ID-only" return pattern for creation endpoints. Enhance Swagger documentation with standardized error response types and ensure consistency across validation, implementation, and testing.

## Prerequisites
- [x] Standard error response types available in `src/_core/types/error-response.type.ts`.
- [x] `PartnerService.create` returns the full created partner object from the repository.

## Implementation Tasks

### 1. DTO Updates
- **File:** `src/partner/dto/partner.dto.ts`
  - Define `PartnerCreateResponseSchema` using Zod: `{ id: string }`.
  - Export `PartnerCreateResponseDto` using `createZodDto`.
  - Define `PartnerCreateSingleResponseDto` by wrapping the above schema with `makeResponseDto` for Swagger consistency.

### 2. Controller Adjustments
- **File:** `src/partner/partner.controller.ts`
  - Update the `@Post()` method's `@ApiResponse`:
    - Set `status: 201` type to `PartnerCreateSingleResponseDto`.
    - Enhance error responses using `src/_core/types/error-response.type.ts` helpers:
      - `status: 400`: Use `ErrorResponseDto` (validation errors).
      - `status: 401`: Use `UnauthorizedResponseDto`.
  - Refactor the `create` method to return only the `id` of the created partner:
    ```typescript
    const result = await this.partnerService.create(req.user.id, dto);
    return { id: result.id };
    ```

### 3. Service refinement (Optional)
- Ensure `PartnerService.create` remains robust, but if internal consumers only need the ID, consider if any overhead can be reduced (currently it returns the full object from repository, which is fine as the controller will filter it).

## Verification Plan

### Automated Tests
- **Unit Tests:**
  - Update `src/partner/partner.service.spec.ts` (if existing) or verify that service tests still pass despite the controller return change.
- **E2E Tests:**
  - **File:** `test/partner.e2e-spec.ts`
  - Update the `POST /partners` test cases to expect only `{ data: { id: string } }` instead of the full partner object.
  - Verify that downstream tests (e.g., those that fetch the created partner) still work by using the returned ID.

### Swagger & Linting
- **Swagger UI:** Verify that the `POST /partners` response model in Swagger correctly displays `{ data: { id: string } }` and that the error models (400, 401) are correctly linked to `ErrorResponseDto`.
- **Project Standards:** Run `pnpm run lint` and `pnpm run build` to ensure no regressions or type mismatches were introduced.
