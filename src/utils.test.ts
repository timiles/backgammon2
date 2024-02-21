import { CheckerContainerModel } from './models/CheckerContainerModel';
import { DieModel } from './models/DieModel';
import Player from './models/Player';
import {
  canMoveChecker,
  createInitialBoardLayout,
  findDestinationIndex,
  getDistance,
  getOtherPlayer,
  getRandomDieValue,
} from './utils';

describe('utils', () => {
  describe('canMoveChecker', () => {
    const board = createInitialBoardLayout();
    const dice: DieModel[] = [
      { value: 6, remainingMoves: 1 },
      { value: 5, remainingMoves: 1 },
    ];

    it('returns true when inspecting checker that has valid moves', () => {
      const canMove = canMoveChecker(board, dice, Player.Black, 0);
      expect(canMove).toBe(true);
    });

    it('returns false when inspecting point that has opponent checkers', () => {
      const canMove = canMoveChecker(board, dice, Player.Red, 0);
      expect(canMove).toBe(false);
    });

    it('returns false when inspecting point that has no checkers', () => {
      const canMove = canMoveChecker(board, dice, Player.Black, 3);
      expect(canMove).toBe(false);
    });

    it('returns true when moving to empty point', () => {
      const canMove = canMoveChecker(board, dice, Player.Black, 0, 6);
      expect(canMove).toBe(true);
    });

    it('returns false when moving to point owned by opponent', () => {
      const canMove = canMoveChecker(board, dice, Player.Black, 0, 5);
      expect(canMove).toBe(false);
    });

    it('returns false when moving invalid distance as per dice', () => {
      const canMove = canMoveChecker(board, dice, Player.Black, 0, 4);
      expect(canMove).toBe(false);
    });

    describe('when Black has checker on bar', () => {
      const board = createInitialBoardLayout();
      const [checker] = board.points[0].checkers.splice(0, 1);
      board.bar[Player.Black].checkers.push(checker);

      it('returns true when moving checker from bar', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 'bar');
        expect(canMove).toBe(true);
      });

      it('returns true when moving checker from bar to empty point', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 'bar', 4);
        expect(canMove).toBe(true);
      });

      it('returns false when moving checker from bar to point owned by opponent', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 'bar', 5);
        expect(canMove).toBe(false);
      });

      it('returns false when moving checker on board', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 0);
        expect(canMove).toBe(false);
      });
    });
  });

  describe('findDestinationIndex', () => {
    const points: CheckerContainerModel[] = [
      { box: { left: 0, right: 10, top: 0, bottom: 10 }, checkers: [] },
      { box: { left: 10, right: 20, top: 0, bottom: 10 }, checkers: [] },
      { box: { left: 0, right: 10, top: 10, bottom: 20 }, checkers: [] },
      { box: { left: 10, right: 20, top: 10, bottom: 20 }, checkers: [] },
    ];

    it('returns index of box that contains location', () => {
      const index = findDestinationIndex(points, 15, 5);
      expect(index).toBe(1);
    });

    it('returns -1 when location is on edge', () => {
      const index = findDestinationIndex(points, 0, 10);
      expect(index).toBe(-1);
    });

    it('returns -1 when location is out of bounds', () => {
      const index = findDestinationIndex(points, 30, 30);
      expect(index).toBe(-1);
    });
  });

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

  describe('getDistance', () => {
    it('handles Black player from bar', () => {
      const distance = getDistance(Player.Black, 'bar', 4);
      expect(distance).toBe(5);
    });

    it('handles Black player from board', () => {
      const distance = getDistance(Player.Black, 12, 15);
      expect(distance).toBe(3);
    });

    it('handles Red player from bar', () => {
      const distance = getDistance(Player.Red, 'bar', 19);
      expect(distance).toBe(5);
    });

    it('handles Red player from board', () => {
      const distance = getDistance(Player.Red, 15, 12);
      expect(distance).toBe(3);
    });
  });

  describe('getRandomDieValue', () => {
    it('returns value in correct range', () => {
      const value = getRandomDieValue();
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });
});
