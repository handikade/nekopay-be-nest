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
 *
 * @param params The parameters for tax calculation.
 * @returns The calculated tax amount rounded to 2 decimal places.
 */
export function calculateTaxAmount(params: CalculateTaxParams): number {
  const { rate, isExclusive, baseAmount } = params;

  let taxAmount: number;

  if (isExclusive) {
    // Exclusive Tax: taxAmount = baseAmount * rate
    taxAmount = baseAmount * rate;
  } else {
    // Inclusive Tax: taxAmount = baseAmount - (baseAmount / (1 + rate))
    taxAmount = baseAmount - baseAmount / (1 + rate);
  }

  // Round to 2 decimal places
  return Math.round(taxAmount * 100) / 100;
}
