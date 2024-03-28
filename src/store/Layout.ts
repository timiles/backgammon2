import { createReducer } from '@reduxjs/toolkit';

import { registerCheckersAreaBox } from './actions';
import { BoxModel } from '../models';

interface LayoutState {
  checkersAreaBox: BoxModel | undefined;
}

const defaultState: LayoutState = { checkersAreaBox: undefined };

export const layoutReducer = createReducer(defaultState, (builder) => {
  builder.addCase(registerCheckersAreaBox, (state, action) => {
    const { box } = action.payload;

    state.checkersAreaBox = box;
  });
});
