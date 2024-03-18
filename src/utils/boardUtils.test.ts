import { canMoveChecker, createInitialBoardLayout, getDistance, getPipCount } from './boardUtils';
import { createDice } from './diceUtils';
import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from '../constants';
import { BoardModel } from '../models';

function moveCheckersFromIndexToIndex(
  board: BoardModel,
  player: Player,
  fromIndex: number,
  toIndex: number,
  numberOfCheckers?: number,
): void {
  const source = board.points[player][fromIndex];
  const destination = board.points[player][toIndex];

  const checkers = source.checkers.splice(0, numberOfCheckers ?? source.checkers.length);
  destination.checkers.push(...checkers);
}

describe('boardUtils', () => {
  describe('canMoveChecker', () => {
    describe('from initial board', () => {
      const board = createInitialBoardLayout();
      const dice = createDice([6, 5]);

      it('returns true when inspecting checker that has valid moves', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 24);
        expect(canMove).toBe(true);
      });

      it('returns false when inspecting point that has no checkers', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 3);
        expect(canMove).toBe(false);
      });

      it('returns true when moving to empty point', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 24, 18);
        expect(canMove).toBe(true);
      });

      it('returns false when moving to point owned by opponent', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 24, 19);
        expect(canMove).toBe(false);
      });

      it('returns false when moving invalid distance as per dice', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 24, 20);
        expect(canMove).toBe(false);
      });

      it('returns false when trying to bear off too early (explicit)', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 6, OFF_POINT_INDEX);
        expect(canMove).toBe(false);
      });

      it('returns false when trying to bear off too early (implicit)', () => {
        const canMove = canMoveChecker(board, dice, Player.Black, 6);
        expect(canMove).toBe(false);
      });
    });

    describe('when Red has checker on bar', () => {
      const board = createInitialBoardLayout();
      moveCheckersFromIndexToIndex(board, Player.Red, 24, BAR_POINT_INDEX, 1);

      const dice = createDice([6, 5]);

      it('returns true when moving checker from bar', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, BAR_POINT_INDEX);
        expect(canMove).toBe(true);
      });

      it('returns true when moving checker from bar to empty point', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, BAR_POINT_INDEX, 20);
        expect(canMove).toBe(true);
      });

      it('returns false when moving checker from bar to point owned by opponent', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, BAR_POINT_INDEX, 19);
        expect(canMove).toBe(false);
      });

      it('returns false for checker from bar when no valid dice', () => {
        const doubleSix = createDice([6, 6]);
        const canMove = canMoveChecker(board, doubleSix, Player.Red, BAR_POINT_INDEX);
        expect(canMove).toBe(false);
      });

      it('returns false when moving checker on board', () => {
        const canMove = canMoveChecker(board, dice, Player.Red, 24);
        expect(canMove).toBe(false);
      });
    });

    describe('when Red is bearing off', () => {
      const board = createInitialBoardLayout();
      // This will leave Red with just 5 checkers on 5-point and 2 checkers on 4-point.
      // Black still has 2 checkers on Red's 1-point.
      moveCheckersFromIndexToIndex(board, Player.Red, 6, 5);
      moveCheckersFromIndexToIndex(board, Player.Red, 24, 4);
      moveCheckersFromIndexToIndex(board, Player.Red, 8, OFF_POINT_INDEX);
      moveCheckersFromIndexToIndex(board, Player.Red, 13, OFF_POINT_INDEX);

      it('returns true when moving checker off with exact dice roll', () => {
        const dice = createDice([5, 3]);
        const canMove = canMoveChecker(board, dice, Player.Red, 5, OFF_POINT_INDEX);
        expect(canMove).toBe(true);
      });

      it('returns true when moving checker off with higher dice roll', () => {
        const dice = createDice([6, 3]);
        const canMove = canMoveChecker(board, dice, Player.Red, 5, OFF_POINT_INDEX);
        expect(canMove).toBe(true);
      });

      it('returns true when moving checker with higher dice roll', () => {
        const dice = createDice([6, 6]);
        const canMove = canMoveChecker(board, dice, Player.Red, 5);
        expect(canMove).toBe(true);
      });

      it('returns false when higher dice roll can be used better', () => {
        const dice = createDice([6, 3]);
        const canMove = canMoveChecker(board, dice, Player.Red, 4, OFF_POINT_INDEX);
        expect(canMove).toBe(false);
      });

      it('returns false when trying to move more than the available dice roll', () => {
        const dice = createDice([2, 1]);
        const canMove = canMoveChecker(board, dice, Player.Red, 4, OFF_POINT_INDEX);
        expect(canMove).toBe(false);
      });
    });
  });

  describe('getDistance', () => {
    it('handles player from bar', () => {
      const distance = getDistance(BAR_POINT_INDEX, 20);
      expect(distance).toBe(5);
    });

    it('handles player from board', () => {
      const distance = getDistance(15, 12);
      expect(distance).toBe(3);
    });

    it('handles player bearing off', () => {
      const distance = getDistance(1, OFF_POINT_INDEX);
      expect(distance).toBe(1);
    });
  });

  describe('getPipCount', () => {
    it('initial board pip count is 167', () => {
      const board = createInitialBoardLayout();
      const redPipCount = getPipCount(board, Player.Red);
      expect(redPipCount).toBe(167);
      const blackPipCount = getPipCount(board, Player.Black);
      expect(blackPipCount).toBe(167);
    });

    it('after moving Red checker, Red pip count is reduced', () => {
      const board = createInitialBoardLayout();
      moveCheckersFromIndexToIndex(board, Player.Red, 24, 20, 1);
      const redPipCount = getPipCount(board, Player.Red);
      expect(redPipCount).toBe(163);
      const blackPipCount = getPipCount(board, Player.Black);
      expect(blackPipCount).toBe(167);
    });
  });
});
