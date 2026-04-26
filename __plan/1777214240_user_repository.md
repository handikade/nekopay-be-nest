# Refined Plan: User Repository Implementation

This plan outlines the steps to implement the `UserRepository` in `src/user/user.repository.ts`. The repository will follow the project's established pattern (reference: `BankRepository`) and provide a clean interface for data access to the `User` model using Prisma.

## Objectives
- Create a dedicated `UserRepository` class.
- Implement standard CRUD operations (Create, Read, Update, Delete).
- Include specialized lookups for unique fields (`email`, `username`).
- Register the repository in a new `UserModule`.

## Prerequisites
- [x] Prisma `User` model defined in `prisma/schema.prisma`.
- [x] `PrismaService` available in `src/prisma/prisma.service.ts`.

## 1. Repository Implementation
Implement the `UserRepository` class in `src/user/user.repository.ts`.

- [x] **Define the Class:**
  - Create `src/user/user.repository.ts`.
  - Use `@Injectable()` decorator.
  - Inject `PrismaService` in the constructor.
- [x] **Implement Data Access Methods:**
  - `create(data: Prisma.UserCreateInput): Promise<User>`
  - `update(id: string, data: Prisma.UserUpdateInput): Promise<User>`
  - `findById(id: string): Promise<User | null>`
  - `findByEmail(email: string): Promise<User | null>`
  - `findByUsername(username: string): Promise<User | null>`
  - `findAll(where: Prisma.UserWhereInput, skip?, take?, orderBy?): Promise<[number, User[]]>` (Include total count using transaction).
  - `delete(id: string): Promise<User>`

## 2. Module Registration
Ensure the repository is available for dependency injection.

- [x] **Create UserModule:**
  - Create `src/user/user.module.ts`.
  - Register `UserRepository` in the `providers` array.
  - Export `UserRepository` in the `exports` array.
- [x] **Update AppModule:**
  - Import `UserModule` into `src/app.module.ts` if not already present.

## 3. Validation Steps
Verify the implementation through static analysis.

- [x] **Static Analysis:**
  - Run linting:
    ```bash
    pnpm run lint
    ```
  - Run type checking and build:
    ```bash
    pnpm run build
    ```

## 4. Reference
The implementation should mirror the structure and transaction patterns found in `src/bank/bank.repository.ts`.
