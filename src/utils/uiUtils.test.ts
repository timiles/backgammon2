import { findDestinationIndex } from './uiUtils';
import { Player } from '../constants';
import { BoxModel } from '../models';

describe('uiUtils', () => {
  describe('findDestinationIndex', () => {
    const boxes: (BoxModel | undefined)[] = [
      undefined,
      { left: 0, right: 10, top: 0, bottom: 10 },
      { left: 10, right: 20, top: 0, bottom: 10 },
      { left: 0, right: 10, top: 10, bottom: 20 },
      { left: 10, right: 20, top: 10, bottom: 20 },
      // ...
    ];

    it('returns index of box that contains location', () => {
      const index = findDestinationIndex(Player.Red, boxes, 15, 5);
      expect(index).toBe(2);
    });

    it(`returns other player's index of box that contains location`, () => {
      const index = findDestinationIndex(Player.Black, boxes, 15, 5);
      expect(index).toBe(23);
    });

    it('returns -1 when location is on edge', () => {
      const index = findDestinationIndex(Player.Red, boxes, 0, 10);
      expect(index).toBe(-1);
    });

    it('returns -1 when location is out of bounds (Red)', () => {
      const index = findDestinationIndex(Player.Red, boxes, 30, 30);
      expect(index).toBe(-1);
    });

    it('returns -1 when location is out of bounds (Black)', () => {
      const index = findDestinationIndex(Player.Black, boxes, 30, 30);
      expect(index).toBe(-1);
    });
  });
});
