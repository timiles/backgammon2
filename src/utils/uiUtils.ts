import {
  Animated,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

import {
  BAR_POINT_INDEX,
  BAR_SECTION_INDEX,
  BOARD_LAYOUT,
  OFF_POINT_INDEX,
  OFF_SECTION_INDEX,
} from '../constants';
import { BoxModel } from '../models';
import { BoxDimensions, Side } from '../types';

export function createGestureResponderHandlers<TLocationId>(
  getLocationId: (x: number, y: number) => TLocationId | null,
  canMoveToLocationId: (locationId: TLocationId) => boolean,
  currentLocation: Animated.ValueXY,
  onMoveStart: () => void,
  onMoveSuccess: (locationId: TLocationId) => void,
  onMoveEnd: () => void,
): GestureResponderHandlers {
  const useNativeDriver = false;

  const returnToOriginalLocation = () => {
    // Otherwise animate back to starting position, then end
    const config: Animated.SpringAnimationConfig = {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver,
    };
    Animated.spring(currentLocation, config).start(() => {
      onMoveEnd();
    });
  };

  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart: () => {
      onMoveStart();
    },
    onPanResponderMove: Animated.event([null, { dx: currentLocation.x, dy: currentLocation.y }], {
      useNativeDriver,
    }),
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

export function getCheckerSize(boxDimensions: BoxDimensions, numberOfCheckers: number): number {
  return Math.min(
    boxDimensions.width - 10,
    (boxDimensions.height - 10) / Math.max(5, numberOfCheckers),
  );
}
