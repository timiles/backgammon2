import {
  Animated,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

import { getOtherPlayersIndex } from './playerUtils';
import { OFF_POINT_INDEX, Player } from '../constants';
import { BoxModel } from '../models';
import { BoxDimensions } from '../types';

export function createGestureResponderHandlers<TLocationId>(
  getLocationId: (x: number, y: number) => TLocationId,
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
      if (canMoveToLocationId(locationId)) {
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

export function findDestinationIndex(
  player: Player,
  boxes: (BoxModel | undefined)[],
  locationX: number,
  locationY: number,
): number {
  const index = boxes.findIndex(
    (box) =>
      box !== undefined &&
      box.left < locationX &&
      locationX < box.right &&
      box.top < locationY &&
      locationY < box.bottom,
  );
  if (index < 0 || index === OFF_POINT_INDEX) {
    return index;
  }
  return player === Player.Red ? index : getOtherPlayersIndex(index);
}

export function getCheckerSize(boxDimensions: BoxDimensions, numberOfCheckers: number): number {
  return Math.min(
    boxDimensions.width - 10,
    (boxDimensions.height - 10) / Math.max(5, numberOfCheckers),
  );
}
