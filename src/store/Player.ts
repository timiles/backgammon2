import { createReducer } from '@reduxjs/toolkit';

import { initialDiceWinner, moveChecker, rollDice } from './actions';
import { Player } from '../constants';
import { getOtherPlayer } from '../utils/playerUtils';

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
      const { nextBoard, player, playerCanMoveAgain } = action.payload;

      const nextPlayer =
        // Check if player can move again, or has won
        playerCanMoveAgain || nextBoard.pipCounts[player] === 0 ? player : getOtherPlayer(player);

      // For undo/redo, we need to return a new state with each move even if Player didn't change
      return { ...state, currentPlayer: nextPlayer };
    })
    .addCase(rollDice, (state, action) => {
      const { player, playerCanMove } = action.payload;

      const nextPlayer = playerCanMove ? player : getOtherPlayer(player);

      // For undo/redo, we need to return a new state with each roll even if Player didn't change
      return { ...state, currentPlayer: nextPlayer };
    });
});
