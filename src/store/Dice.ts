import { createReducer } from '@reduxjs/toolkit';

import {
  initialDiceWinner,
  keyPress,
  moveChecker,
  resetInitialDice,
  rollDice,
  rollInitialDie,
} from './actions';
import { DieModel } from '../models/DieModel';
import { DieValue } from '../models/DieValue';
import Player from '../models/Player';
import { createDice, getDistance, getOtherPlayer } from '../utils';

interface DiceState {
  dice: DieModel[][];
  isInitialRoll: boolean;
}

const defaultState: DiceState = { dice: [[], []], isInitialRoll: true };

export const diceReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(rollInitialDie, (state, action) => {
      const { player, dieValue } = action.payload;

      state.dice[player][0] = { value: dieValue, remainingMoves: 1 };
    })
    .addCase(resetInitialDice, (state) => {
      state.dice[Player.Black] = [];
      state.dice[Player.Red] = [];
    })
    .addCase(initialDiceWinner, (state, action) => {
      const { winner } = action.payload;

      const loser = getOtherPlayer(winner);
      const loserDie = state.dice[loser][0];

      state.dice[winner][1] = loserDie;
      state.dice[loser] = [];

      state.isInitialRoll = false;
    })
    .addCase(rollDice, (state, action) => {
      const { player, dieValues } = action.payload;

      state.dice[player] = createDice(dieValues);
    })
    .addCase(moveChecker, (state, action) => {
      const { player, sourceIndex, destinationIndex, isLastMove } = action.payload;

      const distance = getDistance(sourceIndex, destinationIndex);

      const remainingDice = state.dice[player].filter((d) => d.remainingMoves > 0);
      const usedDie =
        remainingDice.find((d) => d.value === distance) ??
        // When bearing off, the die used could exceed the distance
        remainingDice.find((d) => d.value > distance);
      if (usedDie) {
        usedDie.remainingMoves -= 1;
      }

      if (isLastMove) {
        state.dice[getOtherPlayer(player)] = [];
      }
    })
    .addCase(keyPress, (state, action) => {
      const { eventKey } = action.payload;
      const { isInitialRoll } = state;

      if (!isInitialRoll) {
        const eventKeyNumber = Number(eventKey);
        if (eventKeyNumber >= 1 && eventKeyNumber <= 6) {
          const dieValue = eventKeyNumber as DieValue;

          for (let player = 0; player < 2; player += 1) {
            for (let dieIndex = 0; dieIndex < state.dice[player].length; dieIndex += 1) {
              const die = state.dice[player][dieIndex];
              if (die.remainingMoves > 0) {
                die.value = dieValue;
                break;
              }
            }
          }
        }
      }
    });
});
