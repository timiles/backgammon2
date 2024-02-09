import { Reducer } from 'redux';

import { AppThunkAction } from '.';
import initialBoardLayout from './initialBoardLayout';
import { BoxModel } from '../models/BoxModel';
import { CounterContainerModel } from '../models/CounterContainerModel';
import { DieModel } from '../models/DieModel';
import Player from '../models/Player';
import { getDistance } from '../utils';

export const BarIndexes = [];
BarIndexes[Player.Red] = 0;
BarIndexes[Player.Black] = 25;

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
    destinationIndex: number;
    resultingDice: DieModel[];
  };
}
type KnownAction = RegisterPointBoxAction | MoveCounterAction;

export const actionCreators = {
  registerPointBox: (index: number, box: BoxModel) => ({
    type: 'RegisterPointBoxAction',
    payload: { index, box },
  }),
  moveCounter:
    (
      id: number,
      player: Player,
      sourceIndex: number,
      destinationIndex: number,
    ): AppThunkAction<KnownAction> =>
    (dispatch, getState) =>
      (async () => {
        const currentDice = getState().dice.present.dice[player];
        const distance = getDistance(player, sourceIndex, destinationIndex);

        // New objects for immutability
        const die1 = { ...currentDice[0] };
        const die2 = { ...currentDice[1] };

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
          [die1, die2].find((x) => x.value === distance).isSpent = true;
        }

        dispatch({
          type: 'MoveCounterAction',
          payload: { id, player, sourceIndex, destinationIndex, resultingDice: [die1, die2] },
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
      const { id, player, sourceIndex, destinationIndex } = action.payload;
      // Create new arrays for immutability / to trigger change detection
      const pointsNext = state.points.slice();
      pointsNext[sourceIndex] = {
        ...state.points[sourceIndex],
        counters: state.points[sourceIndex].counters.slice(),
      };
      pointsNext[destinationIndex] = {
        ...state.points[destinationIndex],
        counters: state.points[destinationIndex].counters.slice(),
      };

      // If we've hit other player's blot, put it on the bar
      if (
        pointsNext[destinationIndex].counters.length === 1 &&
        pointsNext[destinationIndex].counters[0].player !== player
      ) {
        const blot = pointsNext[destinationIndex].counters.splice(0, 1)[0];
        const barIndex = BarIndexes[blot.player];
        pointsNext[barIndex] = {
          ...state.points[barIndex],
          counters: state.points[barIndex].counters.slice(),
        };
        pointsNext[barIndex].counters.push(blot);
      }

      // Move counter
      const counterIndex = pointsNext[sourceIndex].counters.findIndex((x) => x.id === id);
      const counter = pointsNext[sourceIndex].counters.splice(counterIndex, 1)[0];
      pointsNext[destinationIndex].counters.push(counter);

      return { ...state, points: pointsNext };
    }
    default: {
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};
