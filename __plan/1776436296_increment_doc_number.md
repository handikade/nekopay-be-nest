# Increment Document Number Utility

## Objective

Create a flexible utility function to increment document number strings. The function should handle various string formats by incrementing trailing numeric sequences or appending a default sequence.

## Implementation Details

- **File Location**: `src/_core/utils/increment-doc-number.util.ts`
- **Function Name**: `incrementDocNumber`
- **Function Signature**: `export function incrementDocNumber(currentNumber: string): string`
- **Logic**:
  1. **Empty String Check**: If `currentNumber` is an empty string (`""`), return `"001"`.
  2. **Last Character Validation**: Check if the last character of `currentNumber` is a digit (`0-9`).
  3. **Non-Numeric Suffix**: If the last character is **NOT** a digit:
     - Return `currentNumber + "001"`.
  4. **Numeric Suffix**: If the last character **IS** a digit:
     - Extract the numeric part at the end of the string using a regular expression (e.g., `/\d+$/`).
     - Identify the original length of this numeric part (e.g., `"009"` has a length of 3).
     - Increment the numeric value by 1.
     - Pad the incremented value with leading zeros to match the original length. If the incremented value naturally exceeds the original length (e.g., `99` -> `100`), use the new length.
     - Replace the original trailing numeric suffix with the new padded string and return the result.

## Validation Steps

### Unit Testing

- **File Location**: `src/_core/utils/increment-doc-number.util.spec.ts`
- **Test Suite**: `incrementDocNumber`
- **Test Cases**:
  - **Empty Input**:
    - `""` should return `"001"`.
  - **Non-Numeric Endings**:
    - `"INV"` should return `"INV001"`.
    - `"DOC/2026/"` should return `"DOC/2026/001"`.
    - `"ABC-A"` should return `"ABC-A001"`.
  - **Numeric Endings (Incrementing)**:
    - `"INV/2026/009"` should return `"INV/2026/010"`.
    - `"INV99"` should return `"INV100"`.
    - `"123"` should return `"124"`.
    - `"007"` should return `"008"`.
  - **Complex Formats**:
    - `"PO-2025-X-001"` should return `"PO-2025-X-002"`.

### Verification Command

- Execute the following to verify implementation:
  ```bash
  pnpm test src/_core/utils/increment-doc-number.util.spec.ts
  ```

## Quality Standards

- **Style**: Adhere to project linting and formatting rules (`pnpm run lint`, `pnpm run format`).
- **Typing**: Ensure strict TypeScript typing for the function and parameters.
- **Robustness**: The function should not throw exceptions for valid string inputs, as it now handles arbitrary formats gracefully.
