/* eslint-disable import/prefer-default-export */
import * as Board from './Board';
import * as Statuses from './Statuses';

export interface ApplicationState {
  board: Board.BoardState;
  statuses: Statuses.StatusesState;
}

export const reducers = {
  board: Board.reducer,
  statuses: Statuses.reducer,
};
