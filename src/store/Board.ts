/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';
import { CounterContainerModel } from '../models/CounterContainerModel';
import initialBoardLayout from './initialBoardLayout';

export interface BoardState {
  points: CounterContainerModel[];
}

const defaultState = { points: initialBoardLayout };

export const reducer: Reducer<BoardState> = (state: BoardState = defaultState) => (state);
