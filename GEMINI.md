# Agent Mandates

- **Node Version:** Always use Node.js version 22.
- **Package Manager:** Always use `pnpm` for all package management tasks (installing, running scripts, etc.).
- **Workflow:** Never use `npm` or `yarn`. Always prefix commands with `pnpm` when applicable (e.g., `pnpm run lint`, `pnpm add -D @types/jest`).

## Zod v4 Validation Rules

- STRICTLY use Zod v4 syntax. Do NOT use Zod v3 deprecated string methods.
- Top-level string validators:
  - DON'T: `z.string().email()` -> DO: `z.email()`
  - DON'T: `z.string().uuid()` -> DO: `z.uuid()`
  - DON'T: `z.string().url()` -> DO: `z.url()`
- Datetime validation:
  - DON'T: `z.string().datetime()` -> DO: `z.iso.datetime()`
- Enum
  - DON'T: `z.nativeEnum()` -> DO: `z.enum()`
- Minimum length / non-empty:
  - DON'T: `z.string().nonempty()` -> DO: `z.string().min(1)`
