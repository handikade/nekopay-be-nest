import { incrementDocNumber } from './increment-doc-number.util';

describe('incrementDocNumber', () => {
  describe('Empty Input', () => {
    it('should return "001" for an empty string', () => {
      expect(incrementDocNumber('')).toBe('001');
    });
  });

  describe('Non-Numeric Endings', () => {
    it('should return "INV001" for "INV"', () => {
      expect(incrementDocNumber('INV')).toBe('INV001');
    });

    it('should return "DOC/2026/001" for "DOC/2026/"', () => {
      expect(incrementDocNumber('DOC/2026/')).toBe('DOC/2026/001');
    });

    it('should return "ABC-A001" for "ABC-A"', () => {
      expect(incrementDocNumber('ABC-A')).toBe('ABC-A001');
    });
  });

  describe('Numeric Endings (Incrementing)', () => {
    it('should return "INV/2026/010" for "INV/2026/009"', () => {
      expect(incrementDocNumber('INV/2026/009')).toBe('INV/2026/010');
    });

    it('should return "INV100" for "INV99"', () => {
      expect(incrementDocNumber('INV99')).toBe('INV100');
    });

    it('should return "124" for "123"', () => {
      expect(incrementDocNumber('123')).toBe('124');
    });

    it('should return "008" for "007"', () => {
      expect(incrementDocNumber('007')).toBe('008');
    });
  });

  describe('Complex Formats', () => {
    it('should return "PO-2025-X-002" for "PO-2025-X-001"', () => {
      expect(incrementDocNumber('PO-2025-X-001')).toBe('PO-2025-X-002');
    });
  });
});
