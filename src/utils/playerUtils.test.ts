import { getOtherPlayer, getOtherPlayersIndex, getPlayersPointIndex } from './playerUtils';
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

  describe('getOtherPlayersIndex', () => {
    it('returns other players point index', () => {
      const otherIndex = getOtherPlayersIndex(8);
      expect(otherIndex).toBe(17);
    });
  });

  describe('getPlayersPointIndex', () => {
    it('returns index when player is Red', () => {
      const index = getPlayersPointIndex(Player.Red, 8);
      expect(index).toBe(8);
    });

    it('returns other index when player is Black', () => {
      const index = getPlayersPointIndex(Player.Black, 8);
      expect(index).toBe(17);
    });
  });
});
