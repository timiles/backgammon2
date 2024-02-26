import { BoxModel } from './BoxModel';
import { CheckerContainerModel } from './CheckerContainerModel';

export interface BoardModel {
  /**
   * Boxes use Red's indexes to identify each point, and 0 for the off board area
   */
  boxes: BoxModel[];

  /**
   * Points arrays: one for Red, one for Black.
   * Index 0 is off the board.
   * Index 1 is the player's 1-point in their home board.
   * Index 24 is the player's 24-point, ie furthest away.
   * Index 25 is the player's bar.
   */
  points: [CheckerContainerModel[], CheckerContainerModel[]];
}
