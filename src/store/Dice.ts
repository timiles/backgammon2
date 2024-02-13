import { Reducer } from 'redux';

import { MoveCounterAction } from './Board';
import { AppThunkAction } from './index';
import { KeyPressAction } from '..';
import { DieModel } from '../models/DieModel';
import { DieValue } from '../models/DieValue';
import Player from '../models/Player';
import { getDistance, getOtherPlayer } from '../utils';

export interface DiceState {
  dice: DieModel[][];
  isInitialRoll: boolean;
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
  | RollInitialDieAction
  | InitialDiceWinnerAction
  | RollDiceAction
  | MoveCounterAction
  | KeyPressAction;

export const actionCreators = {
  rollInitialDie:
    (player: Player): AppThunkAction<KnownAction> =>
    (dispatch, getState) =>
      (async () => {
        const currentDice = getState().dice.present.dice;
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

const defaultState = { dice: [[], []], isInitialRoll: true };

export const reducer: Reducer<DiceState> = (state: DiceState, action: KnownAction) => {
  switch (action.type) {
    case 'RollInitialDieAction': {
      const { player, dieValue } = action.payload;
      const { dice } = state;

      const otherPlayer = getOtherPlayer(player);
      const diceNext = dice.slice();

      if (diceNext[otherPlayer][0]?.value === dieValue) {
        // Initial roll was a draw. Set value as second die and reset first.
        diceNext[player] = [null, { value: dieValue, remainingMoves: 0 }];
        diceNext[otherPlayer] = [null, { value: dieValue, remainingMoves: 0 }];
      } else {
        diceNext[player] = [{ value: dieValue, remainingMoves: 1 }, diceNext[player][1]];
      }

      return { ...state, dice: diceNext };
    }
    case 'InitialDiceWinnerAction': {
      const { winner } = action.payload;

      const diceNext = state.dice.slice();
      const loser = getOtherPlayer(winner);
      const loserDie = diceNext[loser][0];

      diceNext[winner] = [diceNext[winner][0], loserDie];
      diceNext[loser] = [];
      return { ...state, dice: diceNext, isInitialRoll: false };
    }
    case 'RollDiceAction': {
      const { player, dieValues } = action.payload;

      // If the values are the same, player gets double moves
      const remainingMoves = dieValues[0] === dieValues[1] ? 2 : 1;

      const diceNext = state.dice.slice();
      diceNext[player] = dieValues.map((x) => ({ value: x, remainingMoves }));

      return { ...state, dice: diceNext };
    }
    case 'MoveCounterAction': {
      const { player, sourceIndex, destinationIndex } = action.payload;

      const currentDice = state.dice[player];

      // New objects for immutability
      const die1 = { ...currentDice[0] };
      const die2 = { ...currentDice[1] };

      const distance = getDistance(player, sourceIndex, destinationIndex);

      if (die1.value === distance && die1.remainingMoves > 0) {
        die1.remainingMoves -= 1;
      } else {
        die2.remainingMoves -= 1;
      }

      const diceNext = state.dice.slice();
      diceNext[player] = [die1, die2];

      if (die1.remainingMoves === 0 && die2.remainingMoves === 0) {
        diceNext[getOtherPlayer(player)] = [];
      }

      return { ...state, dice: diceNext };
    }
    case 'KeyPressAction': {
      const { dice, isInitialRoll } = state;

      if (isInitialRoll) {
        return state;
      }

      const { event } = action.payload;
      const eventKeyNumber = Number(event.key);
      if (eventKeyNumber >= 1 && eventKeyNumber <= 6) {
        const dieValue = eventKeyNumber as DieValue;
        const diceNext = dice.slice();

        for (let player = 0; player < 2; player += 1) {
          for (let dieIndex = 0; dieIndex < diceNext[player].length; dieIndex += 1) {
            if (diceNext[player][dieIndex].remainingMoves > 0) {
              diceNext[player] = diceNext[player].slice();
              diceNext[player][dieIndex].value = dieValue;
              break;
            }
          }
        }

        return { ...state, dice: diceNext };
      }
      return state;
    }
    default: {
      const exhaustiveCheck: never = action;
    }
  }
  return state || defaultState;
};

function getRandomDie(): DieValue {
  return Math.ceil(Math.random() * 6) as DieValue;
}
