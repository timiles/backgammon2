import { createReducer } from '@reduxjs/toolkit';

import { moveCounter, registerPointBox } from './actions';
import initialBoardLayout from './initialBoardLayout';
import { CounterContainerModel } from '../models/CounterContainerModel';
import Player from '../models/Player';

export const BarIndexes: number[] = [];
BarIndexes[Player.Red] = 0;
BarIndexes[Player.Black] = 25;

interface BoardState {
  points: CounterContainerModel[];
}

const defaultState: BoardState = { points: initialBoardLayout };

export const boardReducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(registerPointBox, (state, action) => {
      const { index, box } = action.payload;

      state.points[index].box = box;
    })
    .addCase(moveCounter, (state, action) => {
      const { id, player, sourceIndex, destinationIndex } = action.payload;

      // If we've hit other player's blot, put it on the bar
      if (
        state.points[destinationIndex].counters.length === 1 &&
        state.points[destinationIndex].counters[0].player !== player
      ) {
        const [blot] = state.points[destinationIndex].counters.splice(0, 1);
        const barIndex = BarIndexes[blot.player];
        state.points[barIndex].counters.push(blot);
      }

      // Move counter
      const counterIndex = state.points[sourceIndex].counters.findIndex((x) => x.id === id);
      const [counter] = state.points[sourceIndex].counters.splice(counterIndex, 1);
      state.points[destinationIndex].counters.push(counter);
    });
});
