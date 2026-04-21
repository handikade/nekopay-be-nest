# Refined Plan - Partner Next Number Endpoint

This plan outlines the implementation of a new endpoint to retrieve the next available partner number for an authenticated user. It utilizes the `incrementDocNumber` utility to predict the next number based on the user's most recently created partner.

## Objectives
- [x] Add a repository method to find the latest partner number for a specific user.
- [x] Implement service logic to calculate the next partner number.
- [x] Expose a new REST endpoint `GET /partners/next-number`.
- [x] Add Swagger documentation for the new endpoint.
- [x] Verify implementation with unit and E2E tests.

## Prerequisites
- [x] Ensure `src/_core/utils/increment-doc-number.util.ts` is available and correctly exports `incrementDocNumber`.

## Implementation Steps

### 1. DTO Implementation
- [x] Update `src/partner/dto/partner.dto.ts`:
    - [x] Define `PartnerNextNumberSchema` using Zod.
    - [x] Create `PartnerNextNumberDto` class.
    - [x] Create `PartnerNextNumberResponseDto` class using `makeResponseDto` and `makeResponseSchema`.

### 2. Repository Layer
- [x] Update `src/partner/partner.repository.ts`:
    - [x] Add `findLatestNumber(userId: string): Promise<string | null>` method.
    - [x] Query the `Partner` model, filtered by `user_id`, ordered by `created_at` descending, and returning only the `number` field.

### 3. Service Layer
- [x] Update `src/partner/partner.service.ts`:
    - [x] Add `getNextNumber(userId: string): Promise<{ number: string }>` method.
    - [x] Call `partnerRepository.findLatestNumber(userId)`.
    - [x] Use `incrementDocNumber(latestNumber)` to calculate the next number.
    - [x] Return the result in the expected DTO format.

### 4. Controller Layer
- [x] Update `src/partner/partner.controller.ts`:
    - [x] Add `@Get('next-number')` endpoint.
    - [x] **Note:** Ensure this route is defined **BEFORE** `@Get(':id')` to prevent path collision.
    - [x] Apply `@ApiResponse` decorators using `PartnerNextNumberResponseDto`.
    - [x] Inject the authenticated user's ID from `req.user.id`.

## Validation & Testing

### Unit Testing
- [x] Update `src/partner/partner.service.spec.ts` (or create if not exists):
    - [x] Test `getNextNumber` returns "001" when no previous partners exist.
    - [x] Test `getNextNumber` correctly increments an existing number (e.g., "PRT-001" -> "PRT-002").
- [x] Update `src/partner/partner.repository.spec.ts` (if exists):
    - [x] Test `findLatestNumber` returns the most recent number for the user. (Skipped: Repository logic is simple and verified via E2E)

### E2E Testing
- [x] Update `test/partner.e2e-spec.ts`:
    - [x] Add a test case for `GET /partners/next-number`.
    - [x] Verify it returns 200 OK and the expected number structure.
    - [x] Verify it returns the correct next number after creating a partner with a specific number.

### Swagger Documentation
- [x] Verify that the new endpoint appears in Swagger UI with correct response schemas and descriptions.
