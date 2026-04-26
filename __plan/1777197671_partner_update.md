# Refined Plan: Partner Update Flow Implementation

This plan outlines the implementation of the partner update API, including schema definition, service logic, and controller integration.

## Objectives
- Define a robust `PartnerUpdateSchema` to validate update payloads.
- Implement the `update` method in `PartnerService` to handle business logic and ensure user ownership.
- Expose the `PATCH /partners/:id` endpoint in `PartnerController`.

## Prerequisites
- [x] `PartnerRepository` already implements `update` and `findById` methods.
- [x] `PartnerCreateSchema` exists in `src/partner/partner.schema.ts`.

## 1. Schema & DTO Implementation
Refine the validation schemas to handle partial updates.

- [x] In `src/partner/partner.schema.ts`:
  - Define `PartnerUpdateSchema` by making `PartnerCreateSchema` partial, or specifically tailoring it for updates.
- [x] In `src/partner/partner.dto.ts`:
  - Update `PartnerUpdateInputDTO` to use the new `PartnerUpdateSchema`.
  - Ensure `ResponseSuccessPartnerUpdateDto` is correctly typed (it currently uses `PartnerIdSchema`).

## 2. Service Implementation
Implement the update business logic.

- [x] In `src/partner/partner.service.ts`:
  - Implement `update(id: string, userId: string, dto: PartnerUpdateInputDTO)`:
    - Verify the partner exists and belongs to the user by calling `this.findByIdAndUserId({ id, userId })`.
    - Call `partnerRepository.update(id, payload)` with the validated data.
    - Return the updated partner's ID (or the full object if required by convention).

## 3. Controller Implementation
Expose the update route.

- [x] In `src/partner/partner.controller.ts`:
  - Implement the `PATCH :id` endpoint:
    - Decorate with `@Patch(':id')`.
    - Use `@ApiResponse` with status 200 and `ResponseSuccessPartnerUpdateDto`.
    - Use `@ApiValidationErrors()` and `@ApiResourceErrors('Partner')`.
    - Extract `id` from params and `userId` from the request.
    - Call `partnerService.update(id, req.user.id, dto)`.

## 4. Validation Steps
- [x] **Static Analysis:**
  - Run `pnpm run lint` to check for style issues.
  - Run `pnpm run build` to ensure no compilation/type errors.
- [x] **Manual Verification:**
  - Verify the new endpoint appears in Swagger UI.
  - Check that the `types` array and other fields can be updated correctly.
  - Ensure unauthorized users cannot update partners they do not own.
