import { createReducer } from '@reduxjs/toolkit';

import { initialDiceWinner, moveChecker } from './actions';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';

interface PlayerState {
  currentPlayer?: Player;
}

const defaultState: PlayerState = {};

export const playerReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(initialDiceWinner, (state, action) => {
      const { winner } = action.payload;

      state.currentPlayer = winner;
    })
    .addCase(moveChecker, (state, action) => {
      const { player, isLastMove } = action.payload;

      const currentPlayer = !isLastMove ? player : getOtherPlayer(player);

      // For undo/redo, we need to return a new state with each move even if Player didn't change
      return { ...state, currentPlayer };
    });
});
