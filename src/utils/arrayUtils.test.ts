import { distinct } from './arrayUtils';

describe('arrayUtils', () => {
  describe('distinct', () => {
    it('returns distinct strings', () => {
      const input = ['one', 'two', 'two', 'two', 'TWO', 'three'];
      const filtered = input.filter(distinct);
      expect(filtered).toStrictEqual(['one', 'two', 'TWO', 'three']);
    });
  });
});
