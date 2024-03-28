import {
  canMoveChecker,
  createInitialBoardLayout,
  getAllPossibleGoes,
  getDistance,
  getPipCount,
} from './boardUtils';
import { createDice } from './diceUtils';
import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from '../constants';
import { BoardModel } from '../models';
import { Go } from '../types';

function moveCheckersFromIndexToIndex(
  board: BoardModel,
  player: Player,
  fromIndex: number,
  toIndex: number,
  numberOfCheckers?: number,
): void {
  const source = board.points[player][fromIndex];
  const destination = board.points[player][toIndex];

  const checkerIds = source.checkerIds.splice(0, numberOfCheckers ?? source.checkerIds.length);
  destination.checkerIds.push(...checkerIds);
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

    describe('when there is only one way to use both dice', () => {
      const board = createInitialBoardLayout();
      // This creates a black prime across points 5 to 9 (ie red's points 16 to 20)
      moveCheckersFromIndexToIndex(board, Player.Black, 24, 5);
      moveCheckersFromIndexToIndex(board, Player.Black, 13, 7, 2);
      moveCheckersFromIndexToIndex(board, Player.Black, 13, 9, 3);
      // This leaves red checkers only at points 24 and 22
      moveCheckersFromIndexToIndex(board, Player.Red, 13, 22);
      moveCheckersFromIndexToIndex(board, Player.Red, 8, OFF_POINT_INDEX);
      moveCheckersFromIndexToIndex(board, Player.Red, 6, OFF_POINT_INDEX);

      const dice = createDice([6, 1]);

      it('does not allow moving from 24-point', () => {
        // Red could use the 1 to move from 24 to 23, but then would not be able to use the 6
        const canMove = canMoveChecker(board, dice, Player.Red, 24);
        expect(canMove).toBe(false);
      });

      it('does allow moving from 22-point', () => {
        // So Red must move from 22 to 21, then from 21 to 15
        const canMove = canMoveChecker(board, dice, Player.Red, 22);
        expect(canMove).toBe(true);
      });
    });
  });

  describe('getAllPossibleGoes', () => {
    describe('from initial board', () => {
      const board = createInitialBoardLayout();

      it('returns all possible goes with 6 and 5', () => {
        const dice = createDice([6, 5]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 18, destinationIndex: 13 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 8 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 8, destinationIndex: 3 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 8 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 3 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 7, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 8 },
              { sourceIndex: 13, destinationIndex: 7 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 8 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 3 },
            ],
          },
          {
            moves: [
              { sourceIndex: 8, destinationIndex: 3 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
        ];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
      });

      it('returns all possible moves with double 6', () => {
        const dice = createDice([6, 6]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 24, destinationIndex: 18 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
          {
            moves: [
              { sourceIndex: 13, destinationIndex: 7 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
        ];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
      });
    });

    describe('when Red has checker on bar', () => {
      const board = createInitialBoardLayout();
      moveCheckersFromIndexToIndex(board, Player.Red, 24, BAR_POINT_INDEX, 1);

      it('returns all possible moves with 6 and 5', () => {
        const dice = createDice([6, 5]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [
          {
            moves: [
              { sourceIndex: 25, destinationIndex: 20 },
              { sourceIndex: 24, destinationIndex: 18 },
            ],
          },
          {
            moves: [
              { sourceIndex: 25, destinationIndex: 20 },
              { sourceIndex: 20, destinationIndex: 14 },
            ],
          },
          {
            moves: [
              { sourceIndex: 25, destinationIndex: 20 },
              { sourceIndex: 13, destinationIndex: 7 },
            ],
          },
          {
            moves: [
              { sourceIndex: 25, destinationIndex: 20 },
              { sourceIndex: 8, destinationIndex: 2 },
            ],
          },
        ];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
      });

      it('returns no possible moves with double 6', () => {
        const dice = createDice([6, 6]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
      });
    });

    describe('when black has a prime', () => {
      const board = createInitialBoardLayout();
      // This creates a black prime across points 5 to 9 (ie red's points 16 to 20)
      moveCheckersFromIndexToIndex(board, Player.Black, 24, 5);
      moveCheckersFromIndexToIndex(board, Player.Black, 13, 7, 2);
      moveCheckersFromIndexToIndex(board, Player.Black, 13, 9, 3);
      // This leaves red checkers only at points 24 and 22
      moveCheckersFromIndexToIndex(board, Player.Red, 13, 22);
      moveCheckersFromIndexToIndex(board, Player.Red, 8, OFF_POINT_INDEX);
      moveCheckersFromIndexToIndex(board, Player.Red, 6, OFF_POINT_INDEX);

      it('when there is only one way to use both dice, returns only that go', () => {
        const dice = createDice([6, 1]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [
          {
            moves: [
              { sourceIndex: 22, destinationIndex: 21 },
              { sourceIndex: 21, destinationIndex: 15 },
            ],
          },
        ];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
      });

      it('when only one die can be used, returns only that move', () => {
        const dice = createDice([4, 3]);

        const possibleGoes = getAllPossibleGoes(board, dice, Player.Red);

        const expectedPossibleGoes: Go[] = [{ moves: [{ sourceIndex: 24, destinationIndex: 21 }] }];

        expect(possibleGoes).toStrictEqual(expectedPossibleGoes);
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
