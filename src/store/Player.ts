/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';
import { MoveCounterAction } from './Board';
import { InitialDiceWinnerAction } from './Dice';

export interface PlayerState {
  currentPlayer?: Player;
}

type KnownAction = InitialDiceWinnerAction | MoveCounterAction;

const defaultState = {};

export const reducer: Reducer<PlayerState> = (state: PlayerState, action: KnownAction) => {
  switch (action.type) {
    case 'InitialDiceWinnerAction': {
      return { ...state, currentPlayer: action.payload.winner };
    }
    case 'MoveCounterAction': {
      const { player, resultingDice } = action.payload;

      if (resultingDice.some(x => !x.isSpent)) {
        return { ...state, currentPlayer: player };
      }
      return { ...state, currentPlayer: getOtherPlayer(player) };
    }
    default: {
      break;
    }
  }
  return state || defaultState;
};
