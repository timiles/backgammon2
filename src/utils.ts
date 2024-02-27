import { nanoid } from '@reduxjs/toolkit';
import {
  Animated,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';

import { BarPointIndex, OffPointIndex } from './constants';
import { BoardModel } from './models/BoardModel';
import { BoxModel } from './models/BoxModel';
import { DieModel } from './models/DieModel';
import { DieValue } from './models/DieValue';
import Player from './models/Player';
import { BoxDimensions } from './types';

export function canMoveChecker(
  board: BoardModel,
  dice: DieModel[],
  player: Player,
  sourceIndex: number,
  destinationIndex?: number,
): boolean {
  if (board.points[player][BarPointIndex].checkers.length > 0 && sourceIndex !== BarPointIndex) {
    // Player has checkers on the bar, and this is not their bar
    return false;
  }

  if (board.points[player][sourceIndex].checkers.length === 0) {
    // Player doesn't have checkers on requested source
    return false;
  }

  if (destinationIndex !== undefined) {
    if (destinationIndex === OffPointIndex) {
      // Check if this player has any checkers on bar or on points outside of their home board
      if (board.points[player][BarPointIndex].checkers.length > 0) {
        return false;
      }

      for (let index = 7; index <= 24; index += 1) {
        if (board.points[player][index].checkers.length > 0) {
          return false;
        }
      }

      // Now also check the dice roll was enough to bear off
      const distance = getDistance(sourceIndex, destinationIndex);

      const remainingDice = dice.filter((d) => d.remainingMoves > 0);

      if (remainingDice.some((d) => d.value === distance)) {
        // Exact dice roll is available
        return true;
      }

      if (remainingDice.some((d) => d.value > distance)) {
        // A higher dice roll could be used, so check further away points in the home board
        // in case the dice roll must be used on them first
        for (let pointIndex = sourceIndex + 1; pointIndex <= 6; pointIndex += 1) {
          if (canMoveChecker(board, dice, player, pointIndex)) {
            return false;
          }
        }
        // None found, safe to use dice for this move
        return true;
      }

      // Don't have the dice roll available
      return false;
    }

    if (destinationIndex === sourceIndex) {
      // Can't move to the same point
      return false;
    }

    const otherPlayer = getOtherPlayer(player);
    const otherIndex = getOtherPlayersIndex(destinationIndex);
    if (board.points[otherPlayer][otherIndex].checkers.length > 1) {
      // Destination is blocked by other player
      return false;
    }

    const distance = getDistance(sourceIndex, destinationIndex);
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
  function repeat<T>(itemCreator: () => T, times: number): T[] {
    return new Array(times).fill(0).map(() => itemCreator());
  }

  function createCheckers(board: BoardModel, player: Player) {
    board.points[player][6].checkers.push(...repeat(() => ({ id: nanoid() }), 5));
    board.points[player][8].checkers.push(...repeat(() => ({ id: nanoid() }), 3));
    board.points[player][13].checkers.push(...repeat(() => ({ id: nanoid() }), 5));
    board.points[player][24].checkers.push(...repeat(() => ({ id: nanoid() }), 2));
  }

  const initialBoardLayout: BoardModel = {
    boxes: [],
    points: [repeat(() => ({ checkers: [] }), 26), repeat(() => ({ checkers: [] }), 26)],
    pipCounts: [0, 0],
  };

  createCheckers(initialBoardLayout, Player.Red);
  createCheckers(initialBoardLayout, Player.Black);
  initialBoardLayout.pipCounts = [
    getPipCount(initialBoardLayout, Player.Red),
    getPipCount(initialBoardLayout, Player.Black),
  ];

  return initialBoardLayout;
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
  if (index < 0 || index === OffPointIndex) {
    return index;
  }
  return player === Player.Red ? index : getOtherPlayersIndex(index);
}

export function getCheckerSize(boxDimensions: BoxDimensions, numberOfCheckers: number): number {
  return Math.min(boxDimensions.width - 10, (boxDimensions.height - 10) / numberOfCheckers);
}

export function getOtherPlayer(player: Player): Player {
  return ((player + 1) % 2) as Player;
}

export function getOtherPlayersIndex(index: number): number {
  return 25 - index;
}

export function getDistance(sourceIndex: number, destinationIndex: number) {
  return sourceIndex - destinationIndex;
}

export function getPipCount(board: BoardModel, player: Player): number {
  return board.points[player]
    .map((point, index) => point.checkers.length * index)
    .reduce((a, b) => a + b, 0);
}

export function getRandomDieValue(): DieValue {
  return Math.ceil(Math.random() * 6) as DieValue;
}
