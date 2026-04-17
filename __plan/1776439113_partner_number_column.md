# Refined Plan: Add Partner Number Column

## 1. Objectives
Add a `number` column to the `partners` table to store unique identification strings (e.g., `SUPPLIER/001`, `PA-001`). This field is essential for referencing partners in documents like invoices. The change includes updating the Prisma schema and the corresponding Zod DTOs used for API interactions.

## 2. Database Changes
Modify `prisma/schema.prisma` to add the `number` field to the `Partner` model.

- **Field Name:** `number`
- **Type:** `String`
- **Database Type:** `@db.VarChar(50)`
- **Constraints:** `@unique` (optional, based on requirement, but usually partner numbers are unique). Let's make it unique as per standard practices for "number" columns.
- **Nullability:** Should be nullable initially if there is existing data, or provided with a default. Given the instruction is "schema update only", we will define it.

**File:** `prisma/schema.prisma`
```prisma
model Partner {
  id              String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  number          String?        @unique @db.VarChar(50) // Add this line
  name            String         @db.VarChar(255)
  // ... rest of fields
}
```

## 3. DTO Updates
Update the Zod schemas to include the new `number` field. This ensures the field is available in API requests and responses.

### 3.1. Base Schema
**File:** `src/partner/dto/partner.dto.ts`
- Update `PartnerBaseSchema` to include `number`.

```ts
export const PartnerBaseSchema = z.object({
  id: z.uuid().describe('Partner ID'),
  number: z.string().optional().nullable().describe('Partner unique identification number'), // Add this
  name: z.string().describe('Partner company name'),
  // ...
});
```

### 3.2. Creation Payload
**File:** `src/partner/dto/partner-create-payload.dto.ts`
- Update `CreatePartnerSchema` to allow providing a `number` during creation.

```ts
export const CreatePartnerSchema = z.object({
  user_id: z.uuid().describe('User ID the partner belongs to'),
  number: z.string().optional().nullable().describe('Partner unique identification number'), // Add this
  name: z.string().min(1).describe('Partner company name'),
  // ...
});
```

### 3.3. Update Payload
**File:** `src/partner/dto/partner-update-payload.dto.ts`
- No direct change needed if it extends `CreatePartnerSchema.partial()`, but verify it works as expected.

## 4. Validation Steps

### 4.1. Prisma Validation
Run the following command to ensure the Prisma schema is valid:
```bash
pnpm prisma validate
```

### 4.2. Compilation Check
Ensure the DTO changes don't break the build:
```bash
pnpm run build
```

### 4.3. Linting
Run lint to ensure consistent style:
```bash
pnpm run lint
```

## 5. Scope Constraints
- **NO MIGRATIONS:** Do not run `prisma migrate dev` or `prisma db push`.
- **NO REPOSITORY CHANGES:** Do not update the `partner.repository.ts` or `partner.service.ts` logic yet.
