/* eslint-disable import/prefer-default-export */
import * as Board from './Board';
import * as Dice from './Dice';
import * as Player from './Player';
import * as Statuses from './Statuses';

export interface ApplicationState {
  board: Board.BoardState;
  dice: Dice.DiceState;
  player: Player.PlayerState;
  statuses: Statuses.StatusesState;
}

export const reducers = {
  board: Board.reducer,
  dice: Dice.reducer,
  player: Player.reducer,
  statuses: Statuses.reducer,
};

// Use on action creators for `dispatch` and `getState` typings
export type AppThunkAction<TAction> =
  (dispatch: (action: TAction) => void, getState: () => ApplicationState) => void;
