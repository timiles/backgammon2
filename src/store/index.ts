import { configureStore } from '@reduxjs/toolkit';
import undoable, { includeAction } from 'redux-undo';

import { boardReducer } from './Board';
import { diceReducer } from './Dice';
import { layoutReducer } from './Layout';
import { playerReducer } from './Player';
import { statusReducer } from './Statuses';
import { initialDiceWinner, moveChecker, rollDice } from './actions';

const undoableFilter = includeAction([initialDiceWinner.type, moveChecker.type, rollDice.type]);

export const store = configureStore({
  reducer: {
    board: undoable(boardReducer, { filter: undoableFilter }),
    dice: undoable(diceReducer, { filter: undoableFilter }),
    layout: layoutReducer,
    player: undoable(playerReducer, { filter: undoableFilter }),
    statuses: undoable(statusReducer, { filter: undoableFilter }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
