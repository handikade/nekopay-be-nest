# Development Plan: Tax Resource

Implement a read-only Tax resource (Get One and Find All) to be used by other modules (e.g., Invoices).

## Objectives
- Create a `tax` module following the project's standard architecture (Controller, Service, Repository, DTOs).
- Provide endpoints to list all taxes with pagination and search.
- Provide an endpoint to retrieve a single tax by its ID.

## Proposed Changes

### 1. DTO Implementation (`src/tax/dto/`)
Follow the Zod-based DTO pattern using `nestjs-zod`.

- **`tax.dto.ts`**:
  - `TaxSchema`: Base schema for Tax (id, code, rate, type, name, created_at, updated_at).
  - `TaxDto`: Class extending `createZodDto(TaxSchema)`.
  - `TaxSingleResponseDto`: Wrapped response for a single tax using `makeResponseDto(makeResponseSchema(TaxSchema))`.
  - `TaxListResponseDto`: Wrapped response for a list of taxes using `makeResponseDto(makeResponseSchema(z.array(TaxSchema)))`.
- **`tax-query.dto.ts`**:
  - `TaxQuerySchema`: Schema for filtering and pagination.
    - `page`: default `1`.
    - `limit`: default `10`.
    - `search`: optional string.
    - `sortBy`: default `'name'`, allowed values: `['name', 'code', 'rate']`.
    - `sortOrder`: default `'asc'`.
  - `TaxQueryDto`: Class extending `createZodDto(TaxQuerySchema)`.

### 2. Repository Implementation (`src/tax/tax.repository.ts`)
Implement `TaxRepository` using `PrismaService`.
- `findAll(where, skip, take, orderBy)`: Returns `[total, data]`.
- `findById(id)`: Returns a single `Tax` or `null`.

### 3. Service Implementation (`src/tax/tax.service.ts`)
Implement `TaxService`.
- `findAll(query)`: 
  - Validates query.
  - Applies search filter (searchable only by `name` using `contains` and `insensitive` mode).
  - Calculates skip/take.
  - Formats the paginated response.
- `findById(id)`: Fetches from repository and throws `NotFoundException` if not found.

### 4. Controller Implementation (`src/tax/tax.controller.ts`)
Implement `TaxController` with comprehensive Swagger documentation.
- **Decorators**: `@ApiTags('taxes')`, `@UseGuards(JwtAuthGuard)`, `@ApiBearerAuth()`.
- **Endpoints**:
  - `GET /taxes`: 
    - JSDoc description for Swagger.
    - `@ApiResponse` with status `200` and type `TaxListResponseDto`.
    - `@ApiResponse` with status `401`.
  - `GET /taxes/:id`: 
    - JSDoc description for Swagger.
    - `@ApiResponse` with status `200` and type `TaxSingleResponseDto`.
    - `@ApiResponse` with status `401`, `404`.

### 5. Module Implementation (`src/tax/tax.module.ts`)
- Define `TaxModule` providing `TaxService` and `TaxRepository`.
- Register `TaxModule` in `src/app.module.ts`.

## Verification Plan

### 1. Automated Tests
- **Unit Tests**:
  - `src/tax/tax.repository.spec.ts`: Test database interactions.
  - `src/tax/tax.service.spec.ts`: Test business logic and Zod validation.
- **E2E Tests**:
  - `test/tax.e2e-spec.ts`: Test `GET /taxes` and `GET /taxes/:id` endpoints with various scenarios (empty list, pagination, not found).

### 2. Manual Verification
- **Swagger Documentation**: Verify that the new endpoints appear in the API docs with correct schemas.
- **Linting & Formatting**: Run `pnpm run lint` and `pnpm run format`.
- **Build**: Run `pnpm run build` to ensure no compilation errors.

## References
- `prisma/schema.prisma`: `Tax` model.
- `src/partner/partner.service.ts`: Pattern for Zod validation and paginated responses.
- `src/_core/types/response.type.ts`: Standardized response wrappers.
