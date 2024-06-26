import { CheckerContainerModel } from './CheckerContainerModel';

export interface BoardModel {
  /**
   * Points arrays: one for Red, one for Black.
   * Index 0 is off the board.
   * Index 1 is the player's 1-point in their home board.
   * Index 24 is the player's 24-point, ie furthest away.
   * Index 25 is the player's bar.
   */
  points: [CheckerContainerModel[], CheckerContainerModel[]];

  pipCounts: [number, number];
}
