import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import { BoxModel } from '../models/BoxModel';
import { CounterContainerModel } from '../models/CounterContainerModel';
import Player from '../models/Player';
import initialBoardLayout from './initialBoardLayout';

export interface BoardState {
  points: CounterContainerModel[];
}

interface RegisterPointBoxAction {
  type: 'RegisterPointBoxAction';
  payload: {
    index: number;
    box: BoxModel;
  };
}
export interface MoveCounterAction {
  type: 'MoveCounterAction';
  payload: {
    id: number;
    player: Player;
    sourceIndex: number;
    targetIndex: number;
    isEndOfTurn: boolean;
  };
}
type KnownAction = RegisterPointBoxAction | MoveCounterAction;

export const actionCreators = {
  registerPointBox: (index: number, box: BoxModel) => ({
    type: 'RegisterPointBoxAction',
    payload: { index, box },
  }),
  moveCounter: (
    id: number,
    player: Player,
    sourceIndex: number,
    targetIndex: number,
  ): AppThunkAction<KnownAction> => (dispatch, getState) => (async () => {
    const remainingDice = getState().dice.dice[player].filter(x => !x.isSpent);
    const isEndOfTurn = remainingDice.length === 1;
    dispatch({
      type: 'MoveCounterAction',
      payload: { id, player, sourceIndex, targetIndex, isEndOfTurn },
    });
  })(),
};

const defaultState = { points: initialBoardLayout };

export const reducer: Reducer<BoardState> = (state: BoardState, action: KnownAction) => {
  switch (action.type) {
    case 'RegisterPointBoxAction': {
      const pointsNext = state.points.slice();
      pointsNext[action.payload.index].box = action.payload.box;
      return { ...state, points: pointsNext };
    }
    case 'MoveCounterAction': {
      const pointsNext = state.points.slice();
      const { id, sourceIndex, targetIndex } = action.payload;
      // Create new arrays to trigger change detection
      pointsNext[sourceIndex].counters = pointsNext[sourceIndex].counters.slice();
      pointsNext[targetIndex].counters = pointsNext[targetIndex].counters.slice();

      const counterIndex = pointsNext[sourceIndex].counters.findIndex(x => x.id === id);
      const counter = pointsNext[sourceIndex].counters.splice(counterIndex, 1)[0];
      pointsNext[targetIndex].counters.push(counter);

      return { ...state, points: pointsNext };
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};
