# Refined Plan: Calculate Tax Utility

## 1. Objectives

Implement a utility function to calculate the tax amount based on the base amount, tax rate, and tax type (Inclusive or Exclusive). This utility ensures consistent tax calculations across the invoicing and financial modules, aligning with the database precision.

## 2. File Information

- **Source Path:** `src/_core/utils/calculate-tax.util.ts`
- **Test Path:** `src/_core/utils/calculate-tax.util.spec.ts`

## 3. Implementation Details

### Function Signature

```ts
export interface CalculateTaxParams {
  /**
   * Tax rate as a decimal value.
   * Example: 0.11 for 11% VAT.
   */
  rate: number;

  /**
   * If true, tax is EXCLUSIVE (added on top of baseAmount).
   * If false, tax is INCLUSIVE (already included in baseAmount).
   */
  isExclusive: boolean;

  /**
   * The base amount to calculate tax from.
   */
  baseAmount: number;
}

/**
 * Calculates the tax amount based on base amount, rate, and type.
 * Rounds the result to 2 decimal places.
 */
export function calculateTaxAmount(params: CalculateTaxParams): number;
```

### Calculation Logic

1.  **Exclusive Tax (Tax added):**
    - `taxAmount = baseAmount * rate`
2.  **Inclusive Tax (Tax included):**
    - `taxAmount = baseAmount - (baseAmount / (1 + rate))`
3.  **Rounding:**
    - Use a rounding strategy (e.g., `Math.round(taxAmount * 100) / 100`) to ensure the result is consistent with the database's `Decimal(12, 2)` precision.

## 4. Verification Steps

### Unit Testing

Create `src/_core/utils/calculate-tax.util.spec.ts` with the following test scenarios:

#### Case 1: Exclusive Tax (11%)

- **Input:** `{ rate: 0.11, isExclusive: true, baseAmount: 100000 }`
- **Expected:** `11000.00`

#### Case 2: Inclusive Tax (11%)

- **Input:** `{ rate: 0.11, isExclusive: false, baseAmount: 111000 }`
- **Expected:** `11000.00` (Calculated: `111000 - (111000 / 1.11) = 111000 - 100000 = 11000`)

#### Case 3: Inclusive Tax (Rounding required)

- **Input:** `{ rate: 0.11, isExclusive: false, baseAmount: 10000 }`
- **Expected:** `990.99` (Calculated: `10000 - (10000 / 1.11) = 990.99099...`)

#### Case 4: Zero Rate

- **Input:** `{ rate: 0, isExclusive: true, baseAmount: 5000 }`
- **Expected:** `0`

#### Case 5: Zero Base Amount

- **Input:** `{ rate: 0.11, isExclusive: true, baseAmount: 0 }`
- **Expected:** `0`

#### Case 6: Negative Base Amount (e.g., Credit Notes)

- **Input:** `{ rate: 0.11, isExclusive: true, baseAmount: -1000 }`
- **Expected:** `-110.00`

### Execution Command

Run the tests using pnpm:

```bash
pnpm jest src/_core/utils/calculate-tax.util.spec.ts
```
