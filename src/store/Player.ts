/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import Player from '../models/Player';
import { InitialDiceWinnerAction } from './Dice';

export interface PlayerState {
  currentPlayer?: Player;
}

type KnownAction = InitialDiceWinnerAction;

const defaultState = {};

export const reducer: Reducer<PlayerState> = (state: PlayerState, action: KnownAction) => {
  switch (action.type) {
    case 'InitialDiceWinnerAction': {
      return { ...state, currentPlayer: action.payload.winner };
    }
    default: {
      break;
    }
  }
  return state || defaultState;
};
