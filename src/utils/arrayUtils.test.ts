import { distinct, repeat } from './arrayUtils';

describe('arrayUtils', () => {
  describe('distinct', () => {
    it('returns distinct strings', () => {
      const input = ['one', 'two', 'two', 'two', 'TWO', 'three'];
      const filtered = input.filter(distinct);
      expect(filtered).toStrictEqual(['one', 'two', 'TWO', 'three']);
    });
  });

  describe('repeat', () => {
    it('returns repeated items', () => {
      const creator = () => ({ value: 123 });
      const values = repeat(creator, 2);

      expect(values).toStrictEqual([{ value: 123 }, { value: 123 }]);
      // Ensure each items is new, not the same reference
      expect(values[0]).not.toBe(values[1]);
    });
  });
});
