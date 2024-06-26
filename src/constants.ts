export const OFF_POINT_INDEX = 0;
export const BAR_POINT_INDEX = 25;

export const OFF_SECTION_INDEX = 13;
export const BAR_SECTION_INDEX = 6;

export enum Player {
  Red = 0,
  Black = 1,
}

type BoardHalfLayout = {
  leftHandPointIndexes: number[];
  rightHandPointIndexes: number[];
  offOwner: Player;
};
export const BOARD_LAYOUT: {
  top: BoardHalfLayout;
  bottom: BoardHalfLayout;
} = {
  top: {
    leftHandPointIndexes: [13, 14, 15, 16, 17, 18],
    rightHandPointIndexes: [19, 20, 21, 22, 23, 24],
    offOwner: Player.Black,
  },
  bottom: {
    leftHandPointIndexes: [12, 11, 10, 9, 8, 7],
    rightHandPointIndexes: [6, 5, 4, 3, 2, 1],
    offOwner: Player.Red,
  },
};
