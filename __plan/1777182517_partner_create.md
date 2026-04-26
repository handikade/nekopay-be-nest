# Refined Plan: Partner Create Flow Implementation

This plan outlines the implementation of the partner creation API, including DTO definition, service logic with automatic number generation, and controller integration.

## Objectives

- Define a robust `PartnerCreateSchema` that handles nested contacts and bank accounts.
- Implement `create` method in `PartnerService` that automatically assigns the next partner number.
- Expose the `POST /partners` endpoint with proper Swagger documentation and validation.

## 1. Schema & DTO Refinement

Ensure that the creation payload is correctly typed and validated.

- [x] In `src/partner/partner.schema.ts`:
  - Define `PartnerCreateSchema` using `PartnerSchema` as a base.
  - Omit system-managed fields (`id`, `created_at`, `updated_at`, `deleted_at`, `user_id`).
  - Add nested validation for `contacts` and `partner_bank_accounts` (using `createMany` or similar logic if appropriate, otherwise simple arrays).
  - Note: `number` should be optional in the input as it will be generated if missing.
- [x] In `src/partner/partner.dto.ts`:
  - Ensure `PartnerCreateInputDTO` uses `createZodDto(PartnerCreateSchema)`.
  - Verify `ResponseSuccessPartnerCreateDto` is ready (it uses `PartnerIdSchema`).

## 2. Service Implementation

Implement the creation logic in `src/partner/partner.service.ts`.

- [x] Implement `create(userId: string, dto: PartnerCreateInputDTO)`:
  - If `dto.number` is not provided, call `this.getNextNumber(userId)` to generate it.
  - Construct the `Prisma.PartnerCreateInput` payload:
    - Connect the `user` using `userId`.
    - Map `contacts` and `partner_bank_accounts` to Prisma's `create` nested structure.
  - Call `partnerRepository.create(payload)`.
  - Return the created partner's ID (formatted via `PartnerIdSchema`).

## 3. Controller Implementation

Expose the endpoint in `src/partner/partner.controller.ts`.

- [x] Implement the `POST /partners` endpoint:
  - Use `@Post()` and `@Body() dto: PartnerCreateInputDTO`.
  - Use `ApiCreatedResponse` with `type: ResponseSuccessPartnerCreateDto`.
  - Add `@ApiValidationErrors()` decorator for standard error handling.
  - Extract `userId` from `req.user.id`.
  - Call `partnerService.create(userId, dto)`.

## 4. Verification & Validation

Ensure the flow is correct and follows project standards.

- [x] **Static Analysis:**
  - Run `pnpm run lint` to check for style issues.
  - Run `pnpm run build` to ensure no compilation errors (this includes type checking).
