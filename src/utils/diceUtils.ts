import { produce } from 'immer';

import { DieModel } from '../models';
import { DieValue } from '../types';

export function createDice([dieValue1, dieValue2]: [DieValue, DieValue]): [DieModel, DieModel] {
  // If the values are the same, player gets double moves
  const remainingMoves = dieValue1 === dieValue2 ? 2 : 1;

  return [
    { value: dieValue1, remainingMoves },
    { value: dieValue2, remainingMoves },
  ];
}

export function getNextDice(dice: DieModel[], distanceMoved: number): DieModel[] {
  return produce(dice, (draftDice) => {
    const usedDie =
      draftDice.find((d) => d.remainingMoves > 0 && d.value === distanceMoved) ??
      // When bearing off, the die used could exceed the distance
      draftDice.find((d) => d.remainingMoves > 0 && d.value > distanceMoved);
    if (usedDie) {
      usedDie.remainingMoves -= 1;
    }
  });
}

export function getRandomDieValue(): DieValue {
  return Math.ceil(Math.random() * 6) as DieValue;
}

export function getRemainingMoves(dice: DieModel[]): number {
  return dice.map((d) => d.remainingMoves).reduce((a, b) => a + b, 0);
}
