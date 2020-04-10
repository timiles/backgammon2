import { Reducer } from 'redux';
import { DieModel } from '../models/DieModel';
import { DieValue } from '../models/DieValue';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';
import { MoveCounterAction } from './Board';
import { AppThunkAction } from './index';

export interface DiceState {
  dice: DieModel[][];
  requiresReroll: boolean[];
}

export interface RollInitialDieAction {
  type: 'RollInitialDieAction';
  payload: {
    player: Player;
    dieValue: DieValue;
    requiresReroll: boolean;
  };
}
export interface InitialDiceWinnerAction {
  type: 'InitialDiceWinnerAction';
  payload: {
    winner: Player;
  };
}
export interface RollDiceAction {
  type: 'RollDiceAction';
  payload: {
    player: Player;
    dieValues: DieValue[];
  };
}
type KnownAction =
  RollInitialDieAction |
  InitialDiceWinnerAction |
  RollDiceAction |
  MoveCounterAction;

export const actionCreators = {
  rollInitialDie: (player: Player): AppThunkAction<KnownAction> => (dispatch, getState) => (
    async () => {
      const currentDice = getState().dice.dice;
      const otherPlayer = getOtherPlayer(player);
      const otherPlayersDie = currentDice[otherPlayer][0];
      const thisPlayersDie = getRandomDie();
      const requiresReroll = otherPlayersDie && thisPlayersDie === otherPlayersDie.value;

      dispatch({
        type: 'RollInitialDieAction',
        payload: {
          player,
          dieValue: thisPlayersDie,
          requiresReroll,
        },
      });

      // Check if there's a winner of the initial roll
      if (otherPlayersDie != null && otherPlayersDie.value !== thisPlayersDie) {
        setTimeout(() => {
          dispatch({
            type: 'InitialDiceWinnerAction',
            payload: {
              winner: thisPlayersDie > otherPlayersDie.value ? player : otherPlayer,
            },
          });
        }, 1000);
      }
    })(),
  rollDice: (player: Player) => ({
    type: 'RollDiceAction',
    payload: { player, dieValues: [getRandomDie(), getRandomDie()] },
  }),
};

const defaultState = { dice: [[], []], requiresReroll: [] };

export const reducer: Reducer<DiceState> = (state: DiceState, action: KnownAction) => {
  switch (action.type) {
    case 'RollInitialDieAction': {
      const { player, dieValue, requiresReroll } = action.payload;
      const diceNext = state.dice.slice();
      const requiresRerollNext = state.requiresReroll.slice();
      if (requiresReroll) {
        diceNext[player] = [null, { value: dieValue, isSpent: true }];
        diceNext[getOtherPlayer(player)] = [null, { value: dieValue, isSpent: true }];
        requiresRerollNext[Player.Red] = true;
        requiresRerollNext[Player.Black] = true;
      } else {
        diceNext[player][0] = { value: dieValue };
        requiresRerollNext[player] = false;
      }
      return { ...state, dice: diceNext, requiresReroll: requiresRerollNext };
    }
    case 'InitialDiceWinnerAction': {
      const { winner } = action.payload;

      const diceNext = state.dice.slice();
      const loser = getOtherPlayer(winner);
      const loserDie = diceNext[loser][0];

      diceNext[winner] = [diceNext[winner][0], loserDie];
      diceNext[loser] = [];
      return { ...state, dice: diceNext };
    }
    case 'RollDiceAction': {
      const { player, dieValues } = action.payload;

      const diceNext = state.dice.slice();
      diceNext[player] = dieValues.map(x => ({ value: x }));

      return { ...state, dice: diceNext };
    }
    case 'MoveCounterAction': {
      const { player, resultingDice } = action.payload;

      const diceNext = state.dice.slice();
      diceNext[player] = resultingDice;

      if (resultingDice.every(x => x.isSpent)) {
        diceNext[getOtherPlayer(player)] = [];
      }

      return { ...state, dice: diceNext };
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};

function getRandomDie(): DieValue {
  return Math.ceil(Math.random() * 6) as DieValue;
}
