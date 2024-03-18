import { createReducer } from '@reduxjs/toolkit';

import { moveChecker } from './actions';
import { BoardModel } from '../models';
import { createInitialBoardLayout } from '../utils/boardUtils';

interface BoardState {
  board: BoardModel;
}

const defaultState: BoardState = { board: createInitialBoardLayout() };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder.addCase(moveChecker, (state, action) => {
    const { nextBoard } = action.payload;

    state.board = nextBoard;
  });
});
