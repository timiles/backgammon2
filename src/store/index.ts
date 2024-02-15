import { Action, configureStore } from '@reduxjs/toolkit';
import undoable, { GroupByFunction, includeAction } from 'redux-undo';

import { boardReducer } from './Board';
import { diceReducer } from './Dice';
import { playerReducer } from './Player';
import { statusReducer } from './Statuses';
import { initialDiceWinner, moveChecker, rollDice } from './actions';
import Player from '../models/Player';
import { getOtherPlayer } from '../utils';

const undoableFilter = includeAction([initialDiceWinner.type, moveChecker.type, rollDice.type]);

const getDiceGroupByKey = (player: Player) => `Dice roll for Player ${player}`;

type DiceState = ReturnType<typeof diceReducer.getInitialState>;
const getDiceGroupBy: GroupByFunction<DiceState, Action> = (action: Action) => {
  if (moveChecker.match(action)) {
    const { player, isLastMove } = action.payload;

    // If this was the Player's last move, we're now waiting for the next Player to roll
    if (isLastMove) {
      return getDiceGroupByKey(getOtherPlayer(player));
    }
  }
  if (rollDice.match(action)) {
    const { player } = action.payload;

    return getDiceGroupByKey(player);
  }
  return null;
};

export const store = configureStore({
  reducer: {
    board: undoable(boardReducer, { filter: undoableFilter }),
    dice: undoable(diceReducer, { filter: undoableFilter, groupBy: getDiceGroupBy }),
    player: undoable(playerReducer, { filter: undoableFilter }),
    statuses: undoable(statusReducer, { filter: undoableFilter }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
