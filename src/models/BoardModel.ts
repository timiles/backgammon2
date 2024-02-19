import { CheckerContainerModel } from './CheckerContainerModel';

export interface BoardModel {
  // 24 points around the board
  points: CheckerContainerModel[];
  // One for Red, one for Black
  bar: [CheckerContainerModel, CheckerContainerModel];
}
