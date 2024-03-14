import { createAction } from '@reduxjs/toolkit';

import { Player } from '../constants';
import { BoardModel, BoxModel, DieModel } from '../models';
import { DieValue } from '../types';

export const initialDiceWinner = createAction<
  {
    winner: Player;
  },
  'INITIAL_DICE_WINNER'
>('INITIAL_DICE_WINNER');

export const keyPress = createAction<
  {
    eventKey: string;
  },
  'KEY_PRESS'
>('KEY_PRESS');

export const moveChecker = createAction<
  {
    player: Player;
    nextBoard: BoardModel;
    nextDice: DieModel[];
    playerCanMoveAgain: boolean;
  },
  'MOVE_CHECKER'
>('MOVE_CHECKER');

export const registerCheckerContainerBox = createAction<
  {
    index: number;
    box: BoxModel;
  },
  'REGISTER_CHECKER_CONTAINER_BOX'
>('REGISTER_CHECKER_CONTAINER_BOX');

export const rollInitialDie = createAction<
  {
    player: Player;
    dieValue: DieValue;
    requiresReroll: boolean;
  },
  'ROLL_INITIAL_DIE'
>('ROLL_INITIAL_DIE');

export const resetInitialDice = createAction<void, 'RESET_INITIAL_DICE'>('RESET_INITIAL_DICE');

export const rollDice = createAction<
  {
    player: Player;
    dice: [DieModel, DieModel];
    playerCanMove: boolean;
  },
  'ROLL_DICE'
>('ROLL_DICE');
