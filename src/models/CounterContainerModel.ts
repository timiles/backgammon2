import { BoxModel } from './BoxModel';

export interface CounterContainerModel {
  player1Count: number;
  player2Count: number;
  box?: BoxModel;
}
