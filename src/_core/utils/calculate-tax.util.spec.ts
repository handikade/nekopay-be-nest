import { calculateTaxAmount } from './calculate-tax.util';

describe('calculateTaxAmount', () => {
  describe('Case 1: Exclusive Tax (11%)', () => {
    it('should return 11000.00 for baseAmount 100000', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: true,
        baseAmount: 100000,
      });
      expect(result).toBe(11000.0);
    });
  });

  describe('Case 2: Inclusive Tax (11%)', () => {
    it('should return 11000.00 for baseAmount 111000', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: false,
        baseAmount: 111000,
      });
      expect(result).toBe(11000.0);
    });
  });

  describe('Case 3: Inclusive Tax (Rounding required)', () => {
    it('should return 990.99 for baseAmount 10000', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: false,
        baseAmount: 10000,
      });
      expect(result).toBe(990.99);
    });
  });

  describe('Case 4: Zero Rate', () => {
    it('should return 0 for baseAmount 5000', () => {
      const result = calculateTaxAmount({
        rate: 0,
        isExclusive: true,
        baseAmount: 5000,
      });
      expect(result).toBe(0);
    });
  });

  describe('Case 5: Zero Base Amount', () => {
    it('should return 0 for rate 0.11', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: true,
        baseAmount: 0,
      });
      expect(result).toBe(0);
    });
  });

  describe('Case 6: Negative Base Amount (e.g., Credit Notes)', () => {
    it('should return -110.00 for baseAmount -1000', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: true,
        baseAmount: -1000,
      });
      expect(result).toBe(-110.0);
    });
  });

  describe('Additional Case: Rounding Half Up', () => {
    it('should round 0.005 up to 0.01', () => {
      // 0.04545... * 100 = 4.545... -> 5 -> 0.05
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: false,
        baseAmount: 0.458, // Just testing rounding behavior
      });
      // (0.458 - 0.458/1.11) = 0.458 - 0.4126126 = 0.0453874
      // Rounded: 0.05
      expect(result).toBe(0.05);
    });

    it('should handle small amounts correctly', () => {
      const result = calculateTaxAmount({
        rate: 0.11,
        isExclusive: true,
        baseAmount: 1.234,
      });
      // 1.234 * 0.11 = 0.13574
      // Rounded to 2 dec: 0.14
      expect(result).toBe(0.14);
    });
  });
});
