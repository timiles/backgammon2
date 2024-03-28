import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerCheckersAreaBox, renderBoard } from './actions';
import { BoxModel, CheckerModel } from '../models';
import { getCheckerSize, getCheckersLocations } from '../utils/uiUtils';

interface LayoutState {
  checkersAreaBox: BoxModel | undefined;

  checkerSize: number | undefined;

  checkers: CheckerModel[];
}

const defaultState: LayoutState = {
  checkersAreaBox: undefined,
  checkerSize: undefined,
  checkers: [],
};

export const layoutReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerCheckersAreaBox, (state, action) => {
      const { box } = action.payload;

      state.checkersAreaBox = box;

      state.checkerSize = getCheckerSize(box.width, box.height);
    })
    .addCase(moveChecker, (state, action) => {
      const { nextBoard } = action.payload;
      const { checkersAreaBox, checkerSize } = state;

      if (checkersAreaBox && checkerSize) {
        state.checkers = getCheckersLocations(nextBoard, checkersAreaBox, checkerSize);
      }
    })
    .addCase(renderBoard, (state, action) => {
      const { board } = action.payload;
      const { checkersAreaBox, checkerSize } = state;

      if (checkersAreaBox && checkerSize) {
        state.checkers = getCheckersLocations(board, checkersAreaBox, checkerSize);
      }
    });
});
