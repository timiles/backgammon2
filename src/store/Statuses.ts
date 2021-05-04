/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';
import { MoveCounterAction } from './Board';
import { InitialDiceWinnerAction, RollDiceAction, RollInitialDieAction } from './Dice';

export interface StatusesState {
  statuses: string[];
}

type KnownAction =
  RollInitialDieAction |
  InitialDiceWinnerAction |
  MoveCounterAction |
  RollDiceAction;

const defaultState = { statuses: ['Roll dice to begin', 'Roll dice to begin'] };

export const reducer: Reducer<StatusesState> = (state: StatusesState, action: KnownAction) => {
  switch (action.type) {
    case 'RollInitialDieAction': {
      const { player, requiresReroll } = action.payload;
      const statusesNext = state.statuses.slice();
      if (requiresReroll) {
        statusesNext[Player.Red] = 'Re-roll!';
        statusesNext[Player.Black] = 'Re-roll!';
      } else {
        statusesNext[player] = `Waiting for ${Player[getOtherPlayer(player)]}...`;
      }
      return { statuses: statusesNext };
    }
    case 'InitialDiceWinnerAction': {
      const { winner } = action.payload;
      const statusesNext = state.statuses.slice();
      statusesNext[winner] = 'You win the initial roll.';
      statusesNext[getOtherPlayer(winner)] = `${Player[winner]} wins the initial roll.`;
      return { statuses: statusesNext };
    }
    case 'MoveCounterAction': {
      const { player, resultingDice } = action.payload;
      if (resultingDice.some(x => !x.isSpent)) {
        return { ...state };
      }
      const statusesNext = [];
      statusesNext[getOtherPlayer(player)] = 'Your turn to roll.';
      return { statuses: statusesNext };
    }
    case 'RollDiceAction': {
      const { player } = action.payload;
      const statusesNext = state.statuses.slice();
      statusesNext[player] = 'Your move.';
      return { statuses: statusesNext };
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};
