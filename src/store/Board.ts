import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerCheckerContainerBox } from './actions';
import { OFF_POINT_INDEX } from '../constants';
import { BoardModel } from '../models/BoardModel';
import { createInitialBoardLayout } from '../utils';

interface BoardState {
  board: BoardModel;
}

const defaultState: BoardState = { board: createInitialBoardLayout() };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerCheckerContainerBox, (state, action) => {
      const { index, box } = action.payload;

      const currentBox = state.board.boxes[index];
      if (index === OFF_POINT_INDEX && currentBox !== undefined) {
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
      const { nextBoard } = action.payload;

      state.board = nextBoard;
    });
});
