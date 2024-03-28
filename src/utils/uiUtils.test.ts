import { findPointIndex } from './uiUtils';
import { BAR_POINT_INDEX, OFF_POINT_INDEX } from '../constants';
import { BoxModel } from '../models';

describe('uiUtils', () => {
  describe('findPointIndex', () => {
    // 14 horizontal sections, make each 10 pixels so width is 140
    const box: BoxModel = { pageX: 100, pageY: 100, width: 140, height: 50 };

    it('returns index of area that contains location (top left)', () => {
      const index = findPointIndex(box, 100, 100);
      expect(index).toBe(13);
    });

    it('returns index of area that contains location (top right)', () => {
      const index = findPointIndex(box, 229, 124);
      expect(index).toBe(24);
    });

    it('returns index of area that contains location (bottom left)', () => {
      const index = findPointIndex(box, 100, 150);
      expect(index).toBe(12);
    });

    it('returns index of area that contains location (bottom right)', () => {
      const index = findPointIndex(box, 221, 126);
      expect(index).toBe(1);
    });

    it('returns index of area that contains location (bar)', () => {
      const index = findPointIndex(box, 165, 140);
      expect(index).toBe(BAR_POINT_INDEX);
    });

    it('returns index of area that contains location (off)', () => {
      const index = findPointIndex(box, 235, 140);
      expect(index).toBe(OFF_POINT_INDEX);
    });

    it('returns null when location is out of bounds', () => {
      const index = findPointIndex(box, 30, 30);
      expect(index).toBe(null);
    });
  });
});
