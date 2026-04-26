# Refined Plan: Partner Detail Flow Implementation

This plan outlines the implementation of the partner detail (find one) API, including schema updates, service refinement, and controller integration.

## Objectives
- Update `PartnerPresentationSchema` to include nested relations (`contacts`, `partner_bank_accounts`).
- Expose the `GET /partners/:id` endpoint in `PartnerController`.
- Ensure the detail flow correctly handles user ownership and data mapping.

## 1. Schema & DTO Enhancements
Refine the presentation schema to provide a comprehensive view of the partner.

- [x] In `src/partner/partner.schema.ts`:
  - Update `PartnerPresentationSchema` to include:
    - `contacts`: Using `PartnerContactPresentationSchema` (from `src/partner-contact/partner-contact.schema.ts`).
    - `partner_bank_accounts`: Using `PartnerBankAccountPresentationSchema` (from `src/partner-bank-account/partner-bank-account.schema.ts`).
  - Ensure all necessary imports for nested presentation schemas are present.

## 2. Service Implementation
Verify and refine the retrieval logic in `src/partner/partner.service.ts`.

- [x] Ensure `findByIdAndUserId({ id, userId })` correctly returns the parsed `PartnerPresentationSchema`.
  - *Note: The repository already includes relations in `findById`, so no changes should be needed there.*

## 3. Controller Implementation
Expose the retrieval route in `src/partner/partner.controller.ts`.

- [x] Implement the `findOne` endpoint:
  - Decorate with `@Get(':id')`.
  - Use `@ApiResponse` with status 200 and `ResponseSuccessPartnerViewDto`.
  - Use `@ApiResourceErrors('Partner')` for standard 403/404 handling.
  - Extract `id` from params and `userId` from the request.
  - Call `partnerService.findByIdAndUserId({ id, userId })`.

## 4. Validation Steps
- [x] **Static Analysis:**
  - Run `pnpm run lint` to check for style and type issues.
  - Run `pnpm run build` to ensure no compilation errors.
- [x] **Manual Verification:**
  - Verify the new endpoint appears in Swagger UI.
  - Test the `GET /partners/:id` endpoint and ensure `contacts` and `partner_bank_accounts` (with nested `bank` details) are returned.
  - Ensure unauthorized users (different `userId`) receive a 404/403 as per `findByIdAndUserId` logic.
