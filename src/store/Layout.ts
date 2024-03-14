import { createReducer } from '@reduxjs/toolkit';

import { registerCheckerContainerBox } from './actions';
import { OFF_POINT_INDEX } from '../constants';
import { BoxModel } from '../models';

interface LayoutState {
  /**
   * Boxes use Red's indexes to identify each point, and 0 for the off board area
   */
  boxes: BoxModel[];
}

const defaultState: LayoutState = { boxes: [] };

export const layoutReducer = createReducer(defaultState, (builder) => {
  builder.addCase(registerCheckerContainerBox, (state, action) => {
    const { index, box } = action.payload;

    if (index === OFF_POINT_INDEX) {
      const currentBox = state.boxes[index];

      if (currentBox?.left === box.left && currentBox.right === box.right) {
        // Expand existing box to cover both areas
        currentBox.top = Math.min(currentBox.top, box.top);
        currentBox.bottom = Math.max(currentBox.bottom, box.bottom);
        return;
      }
    }

    state.boxes[index] = box;
  });
});
