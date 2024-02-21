import { createReducer } from '@reduxjs/toolkit';

import { moveChecker, registerCheckerContainerBox } from './actions';
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

      state.board.points[index].box = box;
    })
    .addCase(moveChecker, (state, action) => {
      const { id, player, sourceIndex, destinationIndex } = action.payload;

      // If we've hit other player's blot, put it on the bar
      const { checkers: destinationPointCheckers } = state.board.points[destinationIndex];
      if (destinationPointCheckers.length === 1 && destinationPointCheckers[0].player !== player) {
        const [blot] = destinationPointCheckers.splice(0, 1);
        state.board.bar[blot.player].checkers.push(blot);
      }

      // Move checker
      const { checkers: sourcePointCheckers } =
        sourceIndex === 'bar' ? state.board.bar[player] : state.board.points[sourceIndex];
      const checkerIndex = sourcePointCheckers.findIndex((x) => x.id === id);
      const [checker] = sourcePointCheckers.splice(checkerIndex, 1);
      destinationPointCheckers.push(checker);
    });
});
