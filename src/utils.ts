import { nanoid } from '@reduxjs/toolkit';
import {
  Animated,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

import { BoardModel } from './models/BoardModel';
import { CheckerContainerModel } from './models/CheckerContainerModel';
import { CheckerModel } from './models/CheckerModel';
import { DieModel } from './models/DieModel';
import { DieValue } from './models/DieValue';
import Player from './models/Player';
import { CheckerSourceIndex } from './types';

export function canMoveChecker(
  board: BoardModel,
  dice: DieModel[],
  player: Player,
  sourceIndex: CheckerSourceIndex,
  destinationIndex?: number,
): boolean {
  if (board.bar[player].checkers.length > 0 && sourceIndex !== 'bar') {
    // Player has checkers on the bar, and this is not their bar
    return false;
  }

  const source = sourceIndex === 'bar' ? board.bar[player] : board.points[sourceIndex];
  if (!source.checkers.some((x) => x.player === player)) {
    // Player doesn't have checkers on requested source
    return false;
  }

  if (destinationIndex !== undefined) {
    if (destinationIndex === sourceIndex) {
      // Can't move to the same point
      return false;
    }

    const otherPlayer = getOtherPlayer(player);
    if (
      board.points[destinationIndex].checkers.filter((x) => x.player === otherPlayer).length > 1
    ) {
      // Destination is blocked by other player
      return false;
    }

    const distance = getDistance(player, sourceIndex, destinationIndex);
    if (!dice.some((x) => x.value === distance && x.remainingMoves > 0)) {
      // Don't have the dice roll available
      return false;
    }
  }

  return true;
}

export function createDice([dieValue1, dieValue2]: [DieValue, DieValue]): [DieModel, DieModel] {
  // If the values are the same, player gets double moves
  const remainingMoves = dieValue1 === dieValue2 ? 2 : 1;

  return [
    { value: dieValue1, remainingMoves },
    { value: dieValue2, remainingMoves },
  ];
}

export function createGestureResponderHandlers<T>(
  getLocationId: (x: number, y: number) => T,
  canMoveToLocationId: (locationId: T) => boolean,
  currentLocation: Animated.ValueXY,
  onMoveStart: () => void,
  onMoveSuccess: (locationId: T) => void,
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

export function createInitialBoardLayout(): BoardModel {
  function black(): CheckerModel {
    return { id: nanoid(), player: Player.Black };
  }

  function red(): CheckerModel {
    return { id: nanoid(), player: Player.Red };
  }

  const initialBoardLayout: BoardModel = {
    points: new Array(24).fill(0).map(() => ({ checkers: [] })),
    bar: [{ checkers: [] }, { checkers: [] }],
  };

  // Black 24-point (Red 1-point)
  initialBoardLayout.points[0].checkers.push(black(), black());
  // Red 6-point
  initialBoardLayout.points[5].checkers.push(red(), red(), red(), red(), red());
  // Red 8-point
  initialBoardLayout.points[7].checkers.push(red(), red(), red());
  // Black 13-point
  initialBoardLayout.points[11].checkers.push(black(), black(), black(), black(), black());
  // Red 13-point
  initialBoardLayout.points[12].checkers.push(red(), red(), red(), red(), red());
  // Black 8-point
  initialBoardLayout.points[16].checkers.push(black(), black(), black());
  // Black 6-point
  initialBoardLayout.points[18].checkers.push(black(), black(), black(), black(), black());
  // Red 24-point
  initialBoardLayout.points[23].checkers.push(red(), red());

  return initialBoardLayout;
}

export function findDestinationIndex(
  points: CheckerContainerModel[],
  locationX: number,
  locationY: number,
): number {
  return (
    points
      // Expect all boxes to be defined - if not, something bad has happened and we deserve to crash
      .map(({ box }) => box!)
      .findIndex(
        ({ left, right, top, bottom }) =>
          left < locationX && locationX < right && top < locationY && locationY < bottom,
      )
  );
}

export function getOtherPlayer(player: Player): Player {
  return ((player + 1) % 2) as Player;
}

export function getDistance(
  player: Player,
  sourceIndex: CheckerSourceIndex,
  destinationIndex: number,
) {
  if (sourceIndex === 'bar') {
    return player === Player.Red ? 24 - destinationIndex : destinationIndex + 1;
  }
  return (destinationIndex - sourceIndex) * (player === Player.Red ? -1 : 1);
}

export function getRandomDieValue(): DieValue {
  return Math.ceil(Math.random() * 6) as DieValue;
}
