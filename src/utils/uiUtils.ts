import {
  Animated,
  Easing,
  GestureResponderEvent,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

import { getPlayersPointIndex } from './playerUtils';
import {
  BAR_POINT_INDEX,
  BAR_SECTION_INDEX,
  BOARD_LAYOUT,
  OFF_POINT_INDEX,
  OFF_SECTION_INDEX,
  Player,
} from '../constants';
import { BoardModel, BoxModel, CheckerModel } from '../models';
import { Side } from '../types';

const OFF_BOARD_CHECKER_PADDING = 2;

const useNativeDriver = false;

export function animateToLocation(
  value: Animated.ValueXY,
  location: { x: number; y: number },
): void {
  Animated.timing(value, {
    toValue: location,
    easing: Easing.ease,
    duration: 50,
    useNativeDriver,
  }).start();
}

export function createGestureResponderHandlers<TLocationId>(
  originalLocation: { x: number; y: number },
  getLocationId: (x: number, y: number) => TLocationId | null,
  canMoveToLocationId: (locationId: TLocationId) => boolean,
  currentLocation: Animated.ValueXY,
  onMoveStart: () => void,
  onMoveSuccess: (locationId: TLocationId) => void,
  onMoveEnd: () => void,
): GestureResponderHandlers {
  const returnToOriginalLocation = () => {
    // Otherwise animate back to original location, then end
    Animated.spring(currentLocation, {
      toValue: originalLocation,
      friction: 5,
      useNativeDriver,
    }).start(() => onMoveEnd());
  };

  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart: () => {
      onMoveStart();
    },
    onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      currentLocation.setValue({
        x: originalLocation.x + gestureState.dx,
        y: originalLocation.y + gestureState.dy,
      });
    },
    onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
      const { moveX, moveY } = gestureState;
      const locationId = getLocationId(moveX, moveY);
      if (locationId !== null && canMoveToLocationId(locationId)) {
        // If we can move, report success and end
        onMoveSuccess(locationId);
        onMoveEnd();
      } else {
        returnToOriginalLocation();
      }
    },
    onPanResponderTerminate: () => {
      returnToOriginalLocation();
    },
  }).panHandlers;
}

export function findPointIndex(
  checkersAreaBox: BoxModel,
  locationX: number,
  locationY: number,
): number | null {
  const { pageX, pageY, width, height } = checkersAreaBox;
  if (
    locationX < pageX ||
    locationX > pageX + width ||
    locationY < pageY ||
    locationY > pageY + height
  ) {
    // Out of bounds
    return null;
  }

  // There are 14 sections across the board horizontally
  const sectionIndex = Math.floor(((locationX - pageX) / width) * 14);

  if (sectionIndex === BAR_SECTION_INDEX) {
    return BAR_POINT_INDEX;
  }
  if (sectionIndex === OFF_SECTION_INDEX) {
    return OFF_POINT_INDEX;
  }

  const side: Side = locationY < pageY + height / 2 ? 'top' : 'bottom';

  const { leftHandPointIndexes, rightHandPointIndexes } = BOARD_LAYOUT[side];

  const pointIndex =
    sectionIndex < 6 ? leftHandPointIndexes[sectionIndex] : rightHandPointIndexes[sectionIndex - 7];

  return pointIndex;
}

export function getCheckerSize(checkersAreaWidth: number, checkersAreaHeight: number): number {
  return Math.min(checkersAreaWidth / 14 - 10, (checkersAreaHeight / 2 - 10) / 5);
}

export function getOffBoardCheckerHeight(checkersAreaHeight: number): number {
  return checkersAreaHeight / 30 - OFF_BOARD_CHECKER_PADDING;
}

function getSectionIndex(pointIndex: number): number {
  switch (pointIndex) {
    case BAR_POINT_INDEX:
      return BAR_SECTION_INDEX;
    case OFF_POINT_INDEX:
      return OFF_SECTION_INDEX;
    default:
      return (
        (pointIndex < 13 ? 12 - pointIndex : pointIndex - 13) +
        (pointIndex > 18 || pointIndex < 7 ? 1 : 0)
      );
  }
}

function getSide(pointIndex: number, player: Player): Side {
  switch (pointIndex) {
    case BAR_POINT_INDEX:
      return player === Player.Red ? 'top' : 'bottom';
    case OFF_POINT_INDEX:
      return player === Player.Red ? 'bottom' : 'top';
    default:
      return pointIndex < 13 ? 'bottom' : 'top';
  }
}

function getCheckerLocation(
  checkersAreaWidth: number,
  checkersAreaHeight: number,
  pointIndex: number,
  checkerNumber: number,
  totalCheckers: number,
  checkerSize: number,
  player: Player,
): { x: number; y: number } {
  const sectionIndex = getSectionIndex(pointIndex);
  const sectionWidth = checkersAreaWidth / 14;
  const x = sectionIndex * sectionWidth + (sectionWidth - checkerSize) / 2;

  const side = getSide(pointIndex, player);

  if (sectionIndex === OFF_SECTION_INDEX) {
    const checkerHeight = getOffBoardCheckerHeight(checkersAreaHeight);

    const offsetFromTop =
      (checkerNumber - 1) * (checkerHeight + OFF_BOARD_CHECKER_PADDING) + OFF_BOARD_CHECKER_PADDING;

    const y = side === 'top' ? offsetFromTop : checkersAreaHeight - checkerHeight - offsetFromTop;

    return { x, y };
  }

  // Add half a checker of padding from the actual middle of the board
  const middle = (checkersAreaHeight - checkerSize) / 2;

  const totalCheckersSize = totalCheckers * checkerSize;
  const overlap =
    totalCheckersSize > middle ? (totalCheckersSize - middle) / (totalCheckers - 1) : 0;

  // This is the distance from the "start"
  const dy = (checkerNumber - 1) * (checkerSize - overlap);

  if (sectionIndex === BAR_SECTION_INDEX) {
    // From the bar, the start is the middle, adjusted for whether top or bottom
    const y = side === 'top' ? middle - checkerSize - dy : checkersAreaHeight - middle + dy;
    return { x, y };
  }

  // For the points, the start is the top or bottom
  const y = side === 'top' ? dy : checkersAreaHeight - checkerSize - dy;
  return { x, y };
}

export function getCheckersLocations(
  board: BoardModel,
  checkersAreaBox: BoxModel,
  checkerSize: number,
): CheckerModel[] {
  return board.points.flatMap((points, player: Player) =>
    points.flatMap((point, pointIndex) =>
      point.checkerIds.map((id, checkerIndex) => ({
        id,
        player,
        pointIndex,
        location: getCheckerLocation(
          checkersAreaBox.width,
          checkersAreaBox.height,
          getPlayersPointIndex(player, pointIndex),
          checkerIndex + 1,
          point.checkerIds.length,
          checkerSize,
          player,
        ),
      })),
    ),
  );
}
