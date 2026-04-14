# Refined Plan: Hide Internal Endpoints from API Documentation

## Objectives
Exclude internal, administrative, or non-public endpoints from the Swagger/Scalar API documentation to provide a cleaner and more secure public API surface.

## Prerequisites
- **Library**: `@nestjs/swagger` (already installed and configured).
- **Decorators**: 
  - `@ApiExcludeController()`: Used to hide an entire controller.
  - `@ApiExcludeEndpoint()`: Used to hide specific methods within a controller.

## Detailed Flow

### 1. Hide Root App Controller
- **Target**: `src/app.controller.ts`
- **Task**: Hide the entire `AppController` which typically contains a basic "Hello World" or root redirect.
- **Action**: Add `@ApiExcludeController()` to the `AppController` class.
- **Verification**: Ensure the root path (e.g., `GET /`) is no longer visible in Scalar UI.

### 2. Hide Partner Restore Endpoint
- **Target**: `src/partner/partner.controller.ts`
- **Method**: `restore` (`PATCH /partners/:id/restore`)
- **Task**: This is an administrative endpoint and should be hidden from the standard partner API docs.
- **Action**: Add `@ApiExcludeEndpoint()` to the `restore` method.
- **Verification**: Search for "restore" in Scalar UI and confirm it is missing from the `partners` tag.

### 3. Hide Administrative Bank Endpoints
- **Target**: `src/bank/bank.controller.ts`
- **Methods**:
  - `create` (`POST /banks`)
  - `findOne` (`GET /banks/:id`)
  - `update` (`PUT /banks/:id`)
  - `remove` (`DELETE /banks/:id`)
- **Task**: Only `findAll` (`GET /banks`) should be public. All other management endpoints must be hidden.
- **Action**: Add `@ApiExcludeEndpoint()` to the `create`, `findOne`, `update`, and `remove` methods.
- **Verification**: Ensure only the `GET /banks` endpoint remains visible under the `banks` tag in Scalar UI.

## Technical Notes
- **Imports**: Ensure `ApiExcludeController` and `ApiExcludeEndpoint` are imported from `@nestjs/swagger`.
- **Consistency**: Use these decorators consistently across the project to manage API visibility.
- **Build**: Run `pnpm run build` after changes to ensure no decorator-related compilation errors occur.

## Verification Checklist
- [ ] `GET /` (AppController) is hidden.
- [ ] `PATCH /partners/:id/restore` is hidden.
- [ ] `POST /banks` is hidden.
- [ ] `GET /banks/:id` is hidden.
- [ ] `PUT /banks/:id` is hidden.
- [ ] `DELETE /banks/:id` is hidden.
- [ ] `GET /banks` (findAll) remains **VISIBLE**.
- [ ] `GET /health` remains **VISIBLE** (standard for monitoring).
