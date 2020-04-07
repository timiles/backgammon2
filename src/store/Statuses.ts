/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';
import { MoveCounterAction } from './Board';
import { InitialDiceWinnerAction, RollDiceAction, RollInitialDieAction } from './Dice';

export interface StatusesState {
  statuses: string[][];
}

type KnownAction =
  RollInitialDieAction |
  InitialDiceWinnerAction |
  MoveCounterAction |
  RollDiceAction;

const defaultState = { statuses: [['Roll dice to begin'], ['Roll dice to begin']] };

export const reducer: Reducer<StatusesState> = (state: StatusesState, action: KnownAction) => {
  switch (action.type) {
    case 'RollInitialDieAction': {
      const { player, requiresReroll } = action.payload;
      const statusesNext = state.statuses.slice();
      if (requiresReroll) {
        statusesNext[Player.Red].push('Re-roll!');
        statusesNext[Player.Black].push('Re-roll!');
      } else {
        statusesNext[player].push(`Waiting for ${Player[getOtherPlayer(player)]}...`);
      }
      return { ...state, statuses: statusesNext };
    }
    case 'InitialDiceWinnerAction': {
      const { winner } = action.payload;
      const statusesNext = state.statuses.slice();
      statusesNext[winner].push('You win the initial roll.');
      statusesNext[getOtherPlayer(winner)].push(`${Player[winner]} wins the initial roll.`);
      return { ...state, statuses: statusesNext };
    }
    case 'MoveCounterAction': {
      const { player, isEndOfTurn } = action.payload;
      if (!isEndOfTurn) {
        return state;
      }
      const statusesNext = state.statuses.slice();
      statusesNext[player].push('');
      statusesNext[getOtherPlayer(player)].push('Your turn to roll.');
      return { ...state, statuses: statusesNext };
    }
    case 'RollDiceAction': {
      const { player } = action.payload;
      const statusesNext = state.statuses.slice();
      statusesNext[player].push('Your move.');
      return { ...state, statuses: statusesNext };
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};
