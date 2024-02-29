import { createReducer } from '@reduxjs/toolkit';

import { initialDiceWinner, moveChecker, rollDice, rollInitialDie } from './actions';
import Player from '../models/Player';
import { getOtherPlayer, getRemainingMoves } from '../utils';

const STATUSES = {
  YOUR_TURN_TO_ROLL: 'Your turn to roll.',
  YOUR_MOVE: 'Your move.',
  YOU_CANNOT_MOVE: 'You cannot move.',
};

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
      const { player, nextBoard, nextDice, playerCanMoveAgain } = action.payload;

      const nextStatuses = state.statuses.slice();

      if (!playerCanMoveAgain) {
        if (nextBoard.pipCounts[player] === 0) {
          nextStatuses[player] = 'You win!';
          nextStatuses[getOtherPlayer(player)] = `${Player[player]} wins!`;
        } else {
          nextStatuses[player] = getRemainingMoves(nextDice) > 0 ? STATUSES.YOU_CANNOT_MOVE : '';
          nextStatuses[getOtherPlayer(player)] = STATUSES.YOUR_TURN_TO_ROLL;
        }
      }

      // For undo/redo, always return a new state even if nothing changed
      return { statuses: nextStatuses };
    })
    .addCase(rollDice, (state, action) => {
      const { player, playerCanMove } = action.payload;

      const nextStatuses = ['', ''];

      if (playerCanMove) {
        nextStatuses[player] = STATUSES.YOUR_MOVE;
      } else {
        nextStatuses[player] = STATUSES.YOU_CANNOT_MOVE;
        nextStatuses[getOtherPlayer(player)] = STATUSES.YOUR_TURN_TO_ROLL;
      }

      // For undo/redo, always return a new state
      return { statuses: nextStatuses };
    });
});
