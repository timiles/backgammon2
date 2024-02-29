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
import { getOtherPlayer } from '../utils';

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
      const { player, dice, playerCanMove } = action.payload;

      if (!playerCanMove) {
        dice[0].remainingMoves = 0;
        dice[1].remainingMoves = 0;
        state.dice[getOtherPlayer(player)] = [];
      }

      state.dice[player] = dice;
    })
    .addCase(moveChecker, (state, action) => {
      const { player, nextDice, playerCanMoveAgain } = action.payload;

      state.dice[player] = nextDice;

      if (!playerCanMoveAgain) {
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
