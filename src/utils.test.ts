import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from './constants';
import { BoardModel } from './models/BoardModel';
import { BoxModel } from './models/BoxModel';
import { DieModel } from './models/DieModel';
import {
  canMoveChecker,
  createInitialBoardLayout,
  findDestinationIndex,
  createDice,
  getDistance,
  getNextDice,
  getOtherPlayer,
  getRandomDieValue,
  getPipCount,
} from './utils';

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

describe('utils', () => {
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

  describe('createDice', () => {
    it('creates dice as expected', () => {
      const dice = createDice([6, 5]);
      expect(dice.length).toBe(2);

      const [die1, die2] = dice;

      expect(die1.value).toBe(6);
      expect(die1.remainingMoves).toBe(1);

      expect(die2.value).toBe(5);
      expect(die2.remainingMoves).toBe(1);
    });

    it('handles doubles', () => {
      const dice = createDice([6, 6]);
      expect(dice.length).toBe(2);

      const [die1, die2] = dice;

      expect(die1.value).toBe(6);
      expect(die1.remainingMoves).toBe(2);

      expect(die2.value).toBe(6);
      expect(die2.remainingMoves).toBe(2);
    });
  });

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

  describe('getNextDice', () => {
    it('reduces die matching distance moved', () => {
      const dice = createDice([3, 4]);
      const nextDice = getNextDice(dice, 3);

      const expectedNextDice: DieModel[] = [
        { value: 3, remainingMoves: 0 },
        { value: 4, remainingMoves: 1 },
      ];
      expect(nextDice).toStrictEqual(expectedNextDice);
    });

    it('reduces die exceeding distance when neither die matches', () => {
      const dice = createDice([2, 4]);
      const nextDice = getNextDice(dice, 3);

      const expectedNextDice: DieModel[] = [
        { value: 2, remainingMoves: 1 },
        { value: 4, remainingMoves: 0 },
      ];
      expect(nextDice).toStrictEqual(expectedNextDice);
    });

    it('ignores die with no remaining moves', () => {
      const dice = createDice([3, 3]);
      dice[0].remainingMoves = 0;

      const nextDice = getNextDice(dice, 3);

      const expectedNextDice: DieModel[] = [
        { value: 3, remainingMoves: 0 },
        { value: 3, remainingMoves: 1 },
      ];
      expect(nextDice).toStrictEqual(expectedNextDice);
    });

    it('does not mutate original dice', () => {
      const dice = createDice([3, 4]);
      getNextDice(dice, 3);

      expect(dice).toStrictEqual(createDice([3, 4]));
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

  describe('getRandomDieValue', () => {
    it('returns value in correct range', () => {
      const value = getRandomDieValue();
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });
});
