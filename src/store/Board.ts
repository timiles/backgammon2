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
type KnownAction = RegisterPointBoxAction;

export const actionCreators = {
  registerPointBox: (index: number, box: BoxModel) => ({
    type: 'RegisterPointBoxAction',
    payload: { index, box },
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
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};
