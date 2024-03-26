export const OFF_POINT_INDEX = 0;
export const BAR_POINT_INDEX = 25;

export enum Player {
  Red = 0,
  Black = 1,
}

type BoardHalfLayout = {
  leftHandPointIndexes: number[];
  rightHandPointIndexes: number[];
  barOwner: Player;
  offOwner: Player;
};
export const BOARD_LAYOUT: {
  top: BoardHalfLayout;
  bottom: BoardHalfLayout;
} = {
  top: {
    leftHandPointIndexes: [13, 14, 15, 16, 17, 18],
    rightHandPointIndexes: [19, 20, 21, 22, 23, 24],
    barOwner: Player.Red,
    offOwner: Player.Black,
  },
  bottom: {
    leftHandPointIndexes: [12, 11, 10, 9, 8, 7],
    rightHandPointIndexes: [6, 5, 4, 3, 2, 1],
    barOwner: Player.Black,
    offOwner: Player.Red,
  },
};
