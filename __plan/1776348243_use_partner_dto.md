# Refined Plan: Use Partner DTO for Swagger Documentation

## Objectives
Integrate the newly created Partner DTOs into the `PartnerController` to provide accurate and detailed Swagger (OpenAPI) documentation. This includes documenting both the request payloads and the standardized response structures (including status codes, messages, and wrapped data).

## Prerequisites
- Existence of `src/partner/dto/partner.dto.ts` with base schemas and DTOs.
- `makeResponseSchema` and `makeResponseDto` available in `src/_core/types/response.type.ts`.
- `TransformInterceptor` is active in the project (wrapping responses).

## Detailed Flow

### 1. Define Wrapped Response DTOs
In `src/partner/dto/partner.dto.ts`, create concrete DTO classes for the wrapped responses using the factories from `src/_core/types/response.type.ts`. This is necessary because NestJS `@ApiResponse` requires a class reference.

- **`PartnerSingleResponseDto`**: For `create`, `update`, `findOne`, `delete`, and `restore` endpoints.
  - Base: `PartnerSchema` or `PartnerFullSchema` depending on the return type.
- **`PartnerListResponseDto`**: For the `findAll` endpoint.
  - Base: `z.array(PartnerResponseSchema)` or `z.array(PartnerAdminResponseSchema)`.

### 2. Update PartnerController with Response Types
In `src/partner/partner.controller.ts`, apply the `@ApiResponse` decorator with the `type` property to all relevant methods:

- **`create`**: `@ApiResponse({ status: 201, type: PartnerSingleResponseDto })`
- **`findAll`**: `@ApiResponse({ status: 200, type: PartnerListResponseDto })`
- **`findOne`**: `@ApiResponse({ status: 200, type: PartnerSingleResponseDto })`
- **`update`**: `@ApiResponse({ status: 200, type: PartnerSingleResponseDto })`
- **`remove`**: `@ApiResponse({ status: 200, type: PartnerSingleResponseDto })`
- **`restore`**: `@ApiResponse({ status: 200, type: PartnerSingleResponseDto })`

### 3. Handle Generic/Dynamic Responses
Since `findAll` and `findOne` can return different shapes based on the user's role (Admin vs. User), choose the most comprehensive DTO (e.g., `PartnerAdminResponseDto` or `PartnerFullDto`) for documentation purposes, or use `@ApiExtraModels` and `getSchemaPath` if advanced polymorphism is required. For this iteration, prioritize the most descriptive "Full" DTOs.

## Technical Notes
- **Imports**: Ensure `makeResponseSchema` and `makeResponseDto` are correctly imported in `src/partner/dto/partner.dto.ts`.
- **Swagger Metadata**: Use `@ApiProperty()` where Zod's `.describe()` might not be sufficient, though `nestjs-zod` should handle most of it automatically.
- **Consistency**: Ensure the `message` and `statusCode` in the Swagger examples match what the `TransformInterceptor` actually produces.

## Verification Steps
1. **Compilation**: Run `pnpm run build` to ensure no circular dependencies or type errors were introduced.
2. **Swagger UI**: (Manual) Start the application and navigate to `/api-docs` (or the configured Swagger path). Verify that:
   - Request bodies match the DTO schemas.
   - Successful (200/201) responses show the wrapped structure with correct data fields.
   - All descriptions from Zod schemas are visible.
