/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import { CounterContainerModel } from '../models/CounterConatinerModel';

export interface BoardState {
  points: CounterContainerModel[];
}

const defaultState = {
  points: [
    { player1Count: 2, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 5 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 3 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 5, player2Count: 0 },
    { player1Count: 0, player2Count: 5 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 3, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 5, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 0 },
    { player1Count: 0, player2Count: 2 },
  ],
};

export const reducer: Reducer<BoardState> = (state: BoardState) => (state || defaultState);
