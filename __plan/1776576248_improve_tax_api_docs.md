# Development Plan: Improve Tax API Documentation (Error Responses)

Improve the API documentation for the `Tax` resource by adding explicit error response schemas and examples to the Swagger/Scalar documentation.

## Objectives
- Standardize the error response DTO based on the global `AllExceptionsFilter`.
- Enhance `TaxController` with detailed `@ApiResponse` decorators for 401, 404, and 500 error codes.
- Ensure Swagger UI displays realistic examples for common error scenarios.

## Proposed Changes

### 1. Global Error DTO Implementation
Create a new file `src/_core/types/error-response.type.ts` to define the error structure used by `AllExceptionsFilter`.

- **Symbol Name:** `ErrorResponseSchema`, `ErrorResponseDto`
- **Fields:**
  - `statusCode`: number
  - `message`: string
  - `error`: string
  - `timestamp`: string (ISO date)
  - `path`: string

### 2. Controller Enhancement (`src/tax/tax.controller.ts`)
Update the `TaxController` to include the error DTO and specific examples.

- **Import:** `ErrorResponseDto` from `src/_core/types/error-response.type.ts`.
- **Decorators:** Update `@ApiResponse` for all endpoints:
  - **401 Unauthorized:** Add `type: ErrorResponseDto` and an example for authentication failure.
  - **404 Not Found:** (For `findOne`) Add `type: ErrorResponseDto` and an example for a non-existent tax ID.
  - **500 Internal Server Error:** Add a global or per-method `@ApiResponse` with `type: ErrorResponseDto` and an example (e.g., database connection or invalid UUID format error).

### 3. Specific Examples to Include

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2026-04-19T05:17:10.452Z",
  "path": "/taxes"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Tax not found",
  "error": "Not Found",
  "timestamp": "2026-04-19T05:17:52.085Z",
  "path": "/taxes/fc873fbc-234b-4181-b5f1-690e73057e52"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Invalid `this.prisma.tax.findUnique()` invocation...",
  "error": "Internal Server Error",
  "timestamp": "2026-04-19T05:54:26.055Z",
  "path": "/taxes/invalid-uuid"
}
```

## Verification Plan

### 1. Automated Checks
- **Linting:** Run `pnpm run lint` to ensure no issues with new DTO or controller changes.
- **Type Check:** Run `pnpm run build` to verify that the `ErrorResponseDto` is correctly integrated.

### 2. Manual Verification
- **Swagger/Scalar UI:**
  - Open `/api` and navigate to the `taxes` section.
  - Verify that 401, 404, and 500 responses have the correct "Schema" defined.
  - Verify that the "Example" values match the ones provided in this plan.
- **Runtime Check (Optional):** Trigger a 401 or 404 via a REST client (like `_rest-dev.rest`) and ensure the response structure matches the documentation.
