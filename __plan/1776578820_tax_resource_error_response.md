# Development Plan: DRY Error Responses in Swagger

Standardize and deduplicate Swagger error documentation by implementing a schema factory and specialized DTOs for common HTTP errors.

## Objectives
- Implement a factory function `makeErrorResponseSchema` in `src/_core/types/error-response.type.ts`.
- Create specialized DTOs for 401 (Unauthorized), 404 (Not Found), and 500 (Internal Server Error).
- Refactor `TaxController` to use these centralized DTOs, removing repetitive inline Swagger examples.
- Ensure the factory and DTOs are fully covered by unit tests.

## Prerequisites
- `src/_core/types/error-response.type.ts` (currently contains `ErrorResponseSchema` and `ErrorResponseDto`).
- `src/_core/types/response.type.ts` (as a reference for the factory pattern).

## Proposed Changes

### 1. Enhance Error Types (`src/_core/types/error-response.type.ts`)
- Implement `makeErrorResponseSchema(options: { statusCode: number; message: string; error: string })`:
  - Returns a new Zod schema extending `ErrorResponseSchema`.
  - Uses `z.literal()` for `statusCode`, `message`, and `error` to ensure Swagger renders them as fixed examples.
- Implement `makeErrorResponseDto` helper:
  - `(schema: z.ZodObject<any>) => createZodDto(schema)`.
- Export standard error DTOs:
  - `UnauthorizedResponseDto` (401, "Unauthorized")
  - `NotFoundResponseDto` (404, "Not Found")
  - `InternalServerErrorResponseDto` (500, "Internal Server Error")

### 2. Unit Testing (`src/_core/types/error-response.type.spec.ts`)
- Create unit tests for `makeErrorResponseSchema`:
  - Verify it correctly extends the base schema.
  - Verify it literalizes the provided values.
- Verify that `ErrorResponseDto` and the new specialized DTOs can be instantiated correctly.

### 3. Controller Refactoring (`src/tax/tax.controller.ts`)
- Update `TaxController` to use the new specialized DTOs.
- Remove the verbose `content: { 'application/json': { example: { ... } } }` blocks from `@ApiResponse` decorators.
- Example Refactor:
  ```typescript
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  ```

## Verification Plan

### 1. Automated Tests
- Run `pnpm run test src/_core/types/error-response.type.spec.ts`.
- Ensure all tests pass.

### 2. Manual Verification
- **Build:** Run `pnpm run build` to check for compilation or type errors.
- **Swagger Documentation:** 
  - Open the API documentation (Swagger/Scalar).
  - Inspect the `taxes` endpoints.
  - Confirm that the 401, 404, and 500 responses still show the correct JSON structure and example values even though they are no longer defined inline in the controller.

## References
- `src/_core/types/response.type.ts`: Existing implementation of `makeResponseSchema`.
- `src/tax/tax.controller.ts`: Target for refactoring.
