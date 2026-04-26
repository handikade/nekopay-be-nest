# Refined Plan: Partner List Feature Implementation

This plan covers the implementation of the partner list API, including query filtering, pagination, and sorting.

## Objectives
- Enhance `PartnerQuerySchema` to support array filtering by `types` and restricted sorting.
- Implement `findAll` in `PartnerService` with proper pagination and mapping.
- Expose the `findAll` endpoint in `PartnerController`.

## 1. Schema & DTO Enhancements
Update `src/partner/partner.schema.ts` to improve filtering and sorting capabilities.

- [x] Modify `PartnerQuerySchema`:
  - Add `types: z.array(z.nativeEnum(PartnerType)).optional()` (or use `z.preprocess` to handle single string to array conversion).
  - Update `sortBy` to be a `z.enum(['name', 'company_email', 'created_at'])` instead of `PartnerScalarFieldEnumSchema`.
  - Ensure `page` and `limit` have sensible defaults and coercion.
- [x] Verify `PartnerListSchema` includes all necessary fields for the list view.

## 2. Service Implementation
Implement the business logic for fetching partners in `src/partner/partner.service.ts`.

- [x] Add `findAll(userId: string, query: PartnerQueryDTO)` method:
  - Calculate `skip` and `take` based on `page` and `limit`.
  - Construct `Prisma.PartnerWhereInput`:
    - Filter by `user_id: userId`.
    - Handle `search` keyword (search in `name` or `company_email`).
    - Handle `types` filter using `{ hasSome: query.types }` if provided.
  - Call `partnerRepository.findAll` with the constructed where clause, skip, take, and order.
  - Format the result to include `data` (parsed via `PartnerListSchema`) and `meta` (pagination info).

## 3. Controller Implementation
Expose the service method via the API in `src/partner/partner.controller.ts`.

- [x] Uncomment and refine the `findAll` endpoint:
  - Ensure it uses `@Query() query: PartnerQueryDTO`.
  - Pass `req.user.id` and the query object to the service.
  - Document the response using `ResponseSuccessPartnerListDto`.

## 4. Repository Check (Optional)
The `PartnerRepository.findAll` already exists and seems to handle the basics.

- [x] Ensure `PartnerRepository.findAll` select fields match the requirements of `PartnerListSchema`.
- [x] Verify that `deleted_at: null` is consistently handled in the repository.

## 5. Final Validation
Ensure the code is syntactically correct and adheres to project standards.

- [x] Run linting and type checking:
  ```bash
  pnpm run lint
  pnpm run tsc
  ```

## 6. Documentation
- [x] Verify that Swagger UI correctly displays the new query parameters and response structure.
