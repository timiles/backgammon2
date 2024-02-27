import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerCheckerContainerBox } from './actions';
import { BarPointIndex, OffPointIndex } from '../constants';
import { BoardModel } from '../models/BoardModel';
import {
  createInitialBoardLayout,
  getOtherPlayer,
  getOtherPlayersIndex,
  getPipCount,
} from '../utils';

interface BoardState {
  board: BoardModel;
}

const defaultState: BoardState = { board: createInitialBoardLayout() };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerCheckerContainerBox, (state, action) => {
      const { index, box } = action.payload;

      const currentBox = state.board.boxes[index];
      if (index === OffPointIndex && currentBox !== undefined) {
        // Expand existing box to cover both areas
        currentBox.top = Math.min(currentBox.top, box.top);
        currentBox.left = Math.min(currentBox.left, box.left);
        currentBox.right = Math.max(currentBox.right, box.right);
        currentBox.bottom = Math.max(currentBox.bottom, box.bottom);
      } else {
        state.board.boxes[index] = box;
      }
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

        state.board.pipCounts[otherPlayer] = getPipCount(state.board, otherPlayer);
      }

      // Move checker
      const { checkers: sourcePointCheckers } = state.board.points[player][sourceIndex];
      const checkerIndex = sourcePointCheckers.findIndex(({ id }) => id === checkerId);
      const [checker] = sourcePointCheckers.splice(checkerIndex, 1);
      state.board.points[player][destinationIndex].checkers.push(checker);

      state.board.pipCounts[player] = getPipCount(state.board, player);
    });
});
