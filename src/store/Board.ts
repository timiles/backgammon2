import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerCheckerContainerBox } from './actions';
import { BarPointIndex } from '../constants';
import { BoardModel } from '../models/BoardModel';
import { createInitialBoardLayout, getOtherPlayer, getOtherPlayersIndex } from '../utils';

interface BoardState {
  board: BoardModel;
}

const defaultState: BoardState = { board: createInitialBoardLayout() };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerCheckerContainerBox, (state, action) => {
      const { index, box } = action.payload;

      state.board.boxes[index] = box;
    })
    .addCase(moveChecker, (state, action) => {
      const { checkerId, player, sourceIndex, destinationIndex } = action.payload;

      // If we've hit other player's blot, put it on the bar
      const otherPlayer = getOtherPlayer(player);
      const otherIndex = getOtherPlayersIndex(destinationIndex);
      const { checkers: otherPlayersCheckers } = state.board.points[otherPlayer][otherIndex];
      if (otherPlayersCheckers.length === 1) {
        const [blot] = otherPlayersCheckers.splice(0, 1);
        state.board.points[otherPlayer][BarPointIndex].checkers.push(blot);
      }

      // Move checker
      const { checkers: sourcePointCheckers } = state.board.points[player][sourceIndex];
      const checkerIndex = sourcePointCheckers.findIndex(({ id }) => id === checkerId);
      const [checker] = sourcePointCheckers.splice(checkerIndex, 1);
      state.board.points[player][destinationIndex].checkers.push(checker);
    });
});
