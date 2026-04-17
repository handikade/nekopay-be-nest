/**
 * Increments a document number string.
 *
 * Rules:
 * 1. If currentNumber is empty, return "001".
 * 2. If the last character is not a digit, append "001".
 * 3. If the last character is a digit:
 *    - Find the trailing numeric sequence.
 *    - Increment the number by 1.
 *    - Pad with leading zeros to maintain the original length (unless it overflows).
 *
 * @param currentNumber The current document number string.
 * @returns The incremented document number.
 */
export function incrementDocNumber(currentNumber: string): string {
  if (!currentNumber) {
    return '001';
  }

  const lastChar = currentNumber.slice(-1);
  const isDigit = /\d/.test(lastChar);

  if (!isDigit) {
    return `${currentNumber}001`;
  }

  const match = currentNumber.match(/\d+$/);
  if (!match) {
    // This case should theoretically be covered by isDigit check,
    // but for robustness we handle it.
    return `${currentNumber}001`;
  }

  const numericPart = match[0];
  const originalLength = numericPart.length;
  const incrementedValue = parseInt(numericPart, 10) + 1;
  const newNumericPart = incrementedValue.toString().padStart(originalLength, '0');

  const prefix = currentNumber.slice(0, match.index);
  return `${prefix}${newNumericPart}`;
}
