/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import { BoxModel } from '../models/BoxModel';
import { CounterContainerModel } from '../models/CounterContainerModel';
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
interface MoveCounterAction {
  type: 'MoveCounterAction';
  payload: {
    id: number;
    sourceIndex: number;
    targetIndex: number;
  };
}
type KnownAction = RegisterPointBoxAction | MoveCounterAction;

export const actionCreators = {
  registerPointBox: (index: number, box: BoxModel) => ({
    type: 'RegisterPointBoxAction',
    payload: { index, box },
  }),
  moveCounter: (id: number, sourceIndex: number, targetIndex: number) => ({
    type: 'MoveCounterAction',
    payload: { id, sourceIndex, targetIndex },
  }),
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
