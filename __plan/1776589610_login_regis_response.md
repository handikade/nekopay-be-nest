# Plan: Improve Auth Success and Conflict Response Documentation

## Objectives
Align the Swagger/OpenAPI documentation for the Registration and Login endpoints with the actual response structure produced by the application. This involves using structured Zod-based DTOs instead of inline examples to ensure type safety and consistent documentation.

## Prerequisites
- Utilize `makeResponseSchema` and `makeResponseDto` from `src/_core/types/response.type.ts` for success responses.
- Utilize `makeErrorResponseSchema` and `makeErrorResponseDto` from `src/_core/types/error-response.type.ts` for error responses.

## Technical Steps

### 1. Update Error Response Types
- **File:** `src/_core/types/error-response.type.ts`
- **Action:** Add a `ConflictResponseDto` using `makeErrorResponseDto` for standard 409 Conflict responses.
- **Purpose:** Provide a reusable DTO for "Email already exists" or "Invalid credentials" (when 409 is used).

### 2. Create Auth Success DTOs
- **File:** `src/auth/dto/auth-response.dto.ts` (New File)
- **Action:** 
    - Define `RegisterSuccessSchema` as `z.object({ message: z.string() })`.
    - Define `LoginSuccessSchema` as `z.object({ accessToken: z.string() })`.
    - Create `RegisterSuccessResponseDto` using `makeResponseDto(makeResponseSchema(RegisterSuccessSchema))`.
    - Create `LoginSuccessResponseDto` using `makeResponseDto(makeResponseSchema(LoginSuccessSchema))`.
    - Create specialized Conflict DTOs if specific messages are needed for Swagger:
        - `RegisterConflictResponseDto`: `statusCode: 409`, `message: "Email or username already exists"`, `error: "Conflict"`.
        - `LoginConflictResponseDto`: `statusCode: 409`, `message: "Invalid credentials"`, `error: "Conflict"`.

### 3. Update Auth Controller Documentation
- **File:** `src/auth/auth.controller.ts`
- **Action:** Refactor `@ApiResponse` decorators for `register` and `login` methods:
    - **`register`**:
        - `201`: Use `type: RegisterSuccessResponseDto`.
        - `409`: Use `type: RegisterConflictResponseDto`.
        - `500`: Use `type: InternalServerErrorResponseDto`.
    - **`login`**:
        - `201`: Use `type: LoginSuccessResponseDto`.
        - `409`: Use `type: LoginConflictResponseDto`.
    - **General**: Remove manual `schema: { example: ... }` blocks where they are now covered by the DTO types.

## Validation Steps

### 1. Compilation & Quality Check
- Run `pnpm run build` to ensure no TypeScript errors were introduced in the DTOs or Controller.
- Run `pnpm run lint` and `pnpm run format` to maintain project standards.

### 2. Swagger/Scalar Verification
- Start the server and navigate to `/api`.
- Verify the following in the UI:
    - **POST /auth/register**:
        - Status 201 shows the wrapper with `{ statusCode: 201, message: "Success", data: { message: "..." } }`.
        - Status 409 shows the error wrapper with `{ statusCode: 409, message: "Email or username already exists", ... }`.
    - **POST /auth/login**:
        - Status 201 shows the wrapper with `{ statusCode: 201, message: "Success", data: { accessToken: "..." } }`.
        - Status 409 shows the error wrapper with `{ statusCode: 409, message: "Invalid credentials", ... }`.

### 3. Behavioral Verification
- Run `pnpm run test:e2e test/auth.e2e-spec.ts` to ensure that changing the Swagger documentation types didn't break any existing tests or runtime behavior.
