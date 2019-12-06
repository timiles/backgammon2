/* eslint-disable import/prefer-default-export */
import * as Board from './Board';

export interface ApplicationState {
  board: Board.BoardState;
}

export const reducers = {
  board: Board.reducer,
};
