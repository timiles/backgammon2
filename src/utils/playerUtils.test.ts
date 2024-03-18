import { getOtherPlayer } from './playerUtils';
import { Player } from '../constants';

describe('playerUtils', () => {
  describe('getOtherPlayer', () => {
    it('returns Black when passed Red', () => {
      const otherPlayer = getOtherPlayer(Player.Red);
      expect(otherPlayer).toBe(Player.Black);
    });

    it('returns Red when passed Black', () => {
      const otherPlayer = getOtherPlayer(Player.Black);
      expect(otherPlayer).toBe(Player.Red);
    });
  });
});
