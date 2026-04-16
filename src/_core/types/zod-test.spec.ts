import { z } from 'zod';

describe('Zod basic test', () => {
  it('should work', () => {
    const schema = z.object({ a: z.string() });
    const result = schema.safeParse({ a: 'test' });
    expect(result.success).toBe(true);
  });
});
