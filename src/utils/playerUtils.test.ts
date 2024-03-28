import { getOtherPlayer, getOtherPlayersIndex, getPlayersPointIndex } from './playerUtils';
import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from '../constants';

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

    it('returns bar index when passed bar index', () => {
      const otherIndex = getOtherPlayersIndex(BAR_POINT_INDEX);
      expect(otherIndex).toBe(BAR_POINT_INDEX);
    });

    it('returns off index when passed off index', () => {
      const otherIndex = getOtherPlayersIndex(OFF_POINT_INDEX);
      expect(otherIndex).toBe(OFF_POINT_INDEX);
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
