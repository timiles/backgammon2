import { createAction } from '@reduxjs/toolkit';

import { BoxModel } from '../models/BoxModel';
import { DieValue } from '../models/DieValue';
import Player from '../models/Player';

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

export const moveCounter = createAction<
  {
    id: number;
    player: Player;
    sourceIndex: number;
    destinationIndex: number;
    isLastMove: boolean;
  },
  'MOVE_COUNTER'
>('MOVE_COUNTER');

export const registerPointBox = createAction<
  {
    index: number;
    box: BoxModel;
  },
  'REGISTER_POINT_BOX'
>('REGISTER_POINT_BOX');

export const rollInitialDie = createAction<
  {
    player: Player;
    dieValue: DieValue;
    requiresReroll: boolean;
  },
  'ROLL_INITIAL_DIE'
>('ROLL_INITIAL_DIE');

export const rollDice = createAction<
  {
    player: Player;
    dieValues: DieValue[];
  },
  'ROLL_DICE'
>('ROLL_DICE');