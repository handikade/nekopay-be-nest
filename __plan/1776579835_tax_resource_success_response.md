# Plan: Improve Tax Resource Success Response Documentation

## Research and Analysis
- **`statusCode` issue:** In `src/_core/types/response.type.ts`, the `BaseResponseSchema` defines `statusCode` as `z.number().int()`. Without an example or min/max constraints, `nestjs-zod` defaults to `Number.MIN_SAFE_INTEGER` (`-9007199254740991`) in the Swagger documentation.
- **`meta` issue:** The `BaseResponseSchema` defines `meta` as an optional `z.record(z.string(), z.unknown())`. This is too generic and results in an empty object `{}` in the Swagger documentation, even though `TaxService` returns pagination data (total, page, limit, totalPages).
- **Actual Response:** The response includes `statusCode: 200`, `message: "Success"`, and a `meta` object with pagination fields.

## Strategy
Update the core response types to include better defaults and provide a specific schema for paginated responses.

1. **Update `BaseResponseSchema`:** Add an explicit example for `statusCode` and `message`.
2. **Define `PaginationMetaSchema`:** Create a specific Zod schema for pagination metadata.
3. **Create `makePaginatedResponseSchema`:** Add a factory function in `src/_core/types/response.type.ts` for paginated responses.
4. **Update `TaxListResponseDto`:** Use the new paginated schema factory to ensure the Swagger docs correctly reflect the `meta` structure.

## Detailed Plan

### 1. Update `src/_core/types/response.type.ts`
- Add `example(200)` to `statusCode`.
- Add `example('Success')` to `message`.
- Define `PaginationMetaSchema` with `total`, `page`, `limit`, and `totalPages`.
- Implement `makePaginatedResponseSchema` which extends `BaseResponseSchema` but overrides `meta` with `PaginationMetaSchema`.

### 2. Update `src/tax/dto/tax.dto.ts`
- Change `TaxListResponseDto` definition to use `makePaginatedResponseSchema` instead of `makeResponseSchema`.

## Validation Strategy
- Start the application and check the generated Swagger/Scalar documentation at `/api`.
- Verify that `statusCode` now shows `200` instead of a negative number.
- Verify that the `meta` object for the "Get all taxes" endpoint shows the pagination fields (`total`, `page`, etc.).
