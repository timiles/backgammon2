/* eslint-disable import/prefer-default-export */
import { AnyAction } from 'redux';
import undoable, { GroupByFunction, StateWithHistory } from 'redux-undo';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';
import * as BoardStore from './Board';
import * as DiceStore from './Dice';
import * as PlayerStore from './Player';
import * as StatusesStore from './Statuses';

export interface ApplicationState {
  board: StateWithHistory<BoardStore.BoardState>;
  dice: StateWithHistory<DiceStore.DiceState>;
  player: StateWithHistory<PlayerStore.PlayerState>;
  statuses: StateWithHistory<StatusesStore.StatusesState>;
}

const undoableActionTypes = ['InitialDiceWinnerAction', 'RollDiceAction', 'MoveCounterAction'];
const undoableFilter = (anyAction: AnyAction) => undoableActionTypes.includes(anyAction.type);

const getDiceGroupByKey = (player: Player) => `Dice roll for Player ${player}`;
const getDiceGroupBy: GroupByFunction<DiceStore.DiceState, AnyAction> = (anyAction: AnyAction) => {
  if (anyAction.type === 'MoveCounterAction') {
    const action = anyAction as BoardStore.MoveCounterAction;
    // If there are no unspent Dice left, we're waiting for the next Player to roll
    if (!action.payload.resultingDice.some(x => !x.isSpent)) {
      return getDiceGroupByKey(getOtherPlayer(action.payload.player));
    }
  }
  if (anyAction.type === 'RollDiceAction') {
    const action = anyAction as DiceStore.RollDiceAction;
    return getDiceGroupByKey(action.payload.player);
  }
  return null;
};

export const reducers = {
  board: undoable(BoardStore.reducer, { filter: undoableFilter }),
  dice: undoable(DiceStore.reducer, { filter: undoableFilter, groupBy: getDiceGroupBy }),
  player: undoable(PlayerStore.reducer, { filter: undoableFilter }),
  statuses: undoable(StatusesStore.reducer, { filter: undoableFilter }),
};

// Use on action creators for `dispatch` and `getState` typings
export type AppThunkAction<TAction> =
  (dispatch: (action: TAction) => void, getState: () => ApplicationState) => void;
