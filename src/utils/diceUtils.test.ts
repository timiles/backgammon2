import { createDice, getNextDice, getRandomDieValue } from './diceUtils';
import { DieModel } from '../models';

describe('diceUtils', () => {
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

  describe('getRandomDieValue', () => {
    it('returns value in correct range', () => {
      const value = getRandomDieValue();
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });
});
