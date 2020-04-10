import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import { BoxModel } from '../models/BoxModel';
import { CounterContainerModel } from '../models/CounterContainerModel';
import { DieModel } from '../models/DieModel';
import Player from '../models/Player';
import { getDistance } from '../utils';
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
    resultingDice: DieModel[];
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
    const distance = getDistance(player, sourceIndex, targetIndex);
    const resultingDice = getState().dice.dice[player].slice();

    const [die1, die2] = resultingDice;
    const isDouble = die1.value === die2.value;
    if (isDouble) {
      if (!die1.isHalfSpent) {
        die1.isHalfSpent = true;
      } else if (!die1.isSpent) {
        die1.isSpent = true;
      } else if (!die2.isHalfSpent) {
        die2.isHalfSpent = true;
      } else {
        die2.isSpent = true;
      }
    } else {
      resultingDice.find(x => x.value === distance).isSpent = true;
    }

    dispatch({
      type: 'MoveCounterAction',
      payload: { id, player, sourceIndex, targetIndex, resultingDice },
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
