import { createReducer } from '@reduxjs/toolkit';

import { initialDiceWinner, moveChecker, rollDice, rollInitialDie } from './actions';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';

interface StatusesState {
  statuses: string[];
}

const defaultState: StatusesState = { statuses: ['Roll dice to begin', 'Roll dice to begin'] };

export const statusReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(rollInitialDie, (state, action) => {
      const { player, dieValue, requiresReroll } = action.payload;

      if (requiresReroll) {
        state.statuses[Player.Red] = `You both rolled ${dieValue}. Re-roll!`;
        state.statuses[Player.Black] = `You both rolled ${dieValue}. Re-roll!`;
      } else {
        state.statuses[player] = `Waiting for ${Player[getOtherPlayer(player)]}...`;
      }
    })
    .addCase(initialDiceWinner, (state, action) => {
      const { winner } = action.payload;

      state.statuses[winner] = 'You win the initial roll.';
      state.statuses[getOtherPlayer(winner)] = `${Player[winner]} wins the initial roll.`;
    })
    .addCase(moveChecker, (state, action) => {
      const { player, isLastMove } = action.payload;

      if (isLastMove) {
        state.statuses[player] = '';
        state.statuses[getOtherPlayer(player)] = 'Your turn to roll.';
      }
    })
    .addCase(rollDice, (state, action) => {
      const { player } = action.payload;

      state.statuses[player] = 'Your move.';
    });
});
