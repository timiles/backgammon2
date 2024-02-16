import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerPointBox } from './actions';
import initialBoardLayout from './initialBoardLayout';
import { CheckerContainerModel } from '../models/CheckerContainerModel';
import Player from '../models/Player';

export const BarIndexes: number[] = [];
BarIndexes[Player.Red] = 25;
BarIndexes[Player.Black] = 0;

interface BoardState {
  points: CheckerContainerModel[];
}

const defaultState: BoardState = { points: initialBoardLayout };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerPointBox, (state, action) => {
      const { index, box } = action.payload;

      state.points[index].box = box;
    })
    .addCase(moveChecker, (state, action) => {
      const { id, player, sourceIndex, destinationIndex } = action.payload;

      // If we've hit other player's blot, put it on the bar
      if (
        state.points[destinationIndex].checkers.length === 1 &&
        state.points[destinationIndex].checkers[0].player !== player
      ) {
        const [blot] = state.points[destinationIndex].checkers.splice(0, 1);
        const barIndex = BarIndexes[blot.player];
        state.points[barIndex].checkers.push(blot);
      }

      // Move checker
      const checkerIndex = state.points[sourceIndex].checkers.findIndex((x) => x.id === id);
      const [checker] = state.points[sourceIndex].checkers.splice(checkerIndex, 1);
      state.points[destinationIndex].checkers.push(checker);
    });
});
