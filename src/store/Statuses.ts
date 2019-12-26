/* eslint-disable import/prefer-default-export */
import { Reducer } from 'redux';

export interface StatusesState {
  statuses: string[][];
}

const defaultState = { statuses: [['Roll dice to begin'], ['Roll dice to begin']] };

export const reducer: Reducer<StatusesState> = (state: StatusesState) => (state || defaultState);
