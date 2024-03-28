import { nanoid } from '@reduxjs/toolkit';
import { produce } from 'immer';

import { distinct, repeat } from './arrayUtils';
import { getNextDice } from './diceUtils';
import { getOtherPlayer, getOtherPlayersIndex } from './playerUtils';
import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from '../constants';
import { BoardModel, DieModel } from '../models';
import { DieValue, Go, Move } from '../types';

function isMovePossible(
  board: BoardModel,
  dice: DieModel[],
  player: Player,
  sourceIndex: number,
  destinationIndex: number,
): boolean {
  if (
    board.points[player][BAR_POINT_INDEX].checkerIds.length > 0 &&
    sourceIndex !== BAR_POINT_INDEX
  ) {
    // Player has checkers on the bar, and this is not their bar
    return false;
  }

  if (board.points[player][sourceIndex].checkerIds.length === 0) {
    // Player doesn't have checkers on requested source
    return false;
  }

  if (destinationIndex === OFF_POINT_INDEX) {
    // Check if this player has any checkers on bar or on points outside of their home board
    if (board.points[player][BAR_POINT_INDEX].checkerIds.length > 0) {
      return false;
    }

    for (let index = 7; index <= 24; index += 1) {
      if (board.points[player][index].checkerIds.length > 0) {
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
  if (board.points[otherPlayer][otherIndex].checkerIds.length > 1) {
    // Destination is blocked by other player
    return false;
  }

  const distance = getDistance(sourceIndex, destinationIndex);
  if (!dice.some((x) => x.value === distance && x.remainingMoves > 0)) {
    // Don't have the dice roll available
    return false;
  }

  return true;
}

/**
 * This function checks that the move is both possible and legal, ie uses both dice if possible
 */
export function canMoveChecker(
  board: BoardModel,
  dice: DieModel[],
  player: Player,
  sourceIndex: number,
  destinationIndex?: number,
): boolean {
  const remainingDieValues = dice
    .filter((d) => d.remainingMoves > 0)
    .map((d) => d.value)
    .filter(distinct);

  if (remainingDieValues.length === 0) {
    // No dice remaining
    return false;
  }

  if (remainingDieValues.length === 1) {
    // Only one distinct die value remaining, note this also handles doubles
    const dest = destinationIndex ?? getDestinationIndex(sourceIndex, remainingDieValues[0]);
    return isMovePossible(board, dice, player, sourceIndex, dest);
  }

  if (destinationIndex === undefined) {
    // Check if any remaining dice value yields success
    return remainingDieValues.some((dieValue) =>
      canMoveChecker(board, dice, player, sourceIndex, getDestinationIndex(sourceIndex, dieValue)),
    );
  }

  // Destination index is now known
  if (!isMovePossible(board, dice, player, sourceIndex, destinationIndex)) {
    return false;
  }

  // Move is possible - so let's check if other die will then be able to be used
  const nextBoard = getNextBoard(board, player, sourceIndex, destinationIndex);
  const nextDice = getNextDice(dice, getDistance(sourceIndex, destinationIndex));
  if (canMoveAnyChecker(nextBoard, nextDice, player)) {
    // Can use both dice from here, so this move is legal
    return true;
  }

  // Other die cannot be used, so now we get all possible moves and see if any use both dice
  for (const possibleMoves of iteratePossibleMoves(board, dice, player)) {
    // Note that the doubles case has already been handled, so we only expect 1 or 2 possible moves
    if (possibleMoves.length === 2) {
      // Possible to use both dice, so this move is not legal
      return false;
    }
  }

  // Not possible to use both dice, so this move is legal
  return true;
}

export function canMoveAnyChecker(board: BoardModel, dice: DieModel[], player: Player): boolean {
  if (dice.every((d) => d.remainingMoves === 0)) {
    return false;
  }

  for (let index = 1; index <= BAR_POINT_INDEX; index += 1) {
    if (canMoveChecker(board, dice, player, index)) {
      return true;
    }
  }
  return false;
}

export function createInitialBoardLayout(): BoardModel {
  function createCheckers(board: BoardModel, player: Player) {
    board.points[player][6].checkerIds.push(...repeat(() => nanoid(), 5));
    board.points[player][8].checkerIds.push(...repeat(() => nanoid(), 3));
    board.points[player][13].checkerIds.push(...repeat(() => nanoid(), 5));
    board.points[player][24].checkerIds.push(...repeat(() => nanoid(), 2));
  }

  const initialBoardLayout: BoardModel = {
    points: [repeat(() => ({ checkerIds: [] }), 26), repeat(() => ({ checkerIds: [] }), 26)],
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

function* iteratePossibleMoves(
  board: BoardModel,
  dice: DieModel[],
  player: Player,
  startFromSourceIndex: number = BAR_POINT_INDEX,
): Generator<Move[], void> {
  for (let sourceIndex = startFromSourceIndex; sourceIndex > 0; sourceIndex -= 1) {
    const remainingDieValues = dice
      .filter((d) => d.remainingMoves > 0)
      .map((d) => d.value)
      .filter(distinct);
    for (const dieValue of remainingDieValues) {
      const destinationIndex = getDestinationIndex(sourceIndex, dieValue);

      if (isMovePossible(board, dice, player, sourceIndex, destinationIndex)) {
        const distanceMoved = sourceIndex - destinationIndex;
        const nextDice = getNextDice(dice, distanceMoved);

        const move: Move = { sourceIndex, destinationIndex };

        if (nextDice.every((d) => d.remainingMoves === 0)) {
          // No dice left, we're done
          yield [move];
        } else {
          const nextBoard = getNextBoard(board, player, sourceIndex, destinationIndex);

          const iterator = iteratePossibleMoves(nextBoard, nextDice, player, sourceIndex);

          let restOfMoves = iterator.next();
          if (restOfMoves.done) {
            // No more possible moves, we're done
            yield [move];
          } else {
            while (!restOfMoves.done) {
              // Concatenate rest of moves to this move
              yield [move, ...restOfMoves.value];
              restOfMoves = iterator.next();
            }
          }
        }
      }
    }
  }
}

export function getAllPossibleGoes(board: BoardModel, dice: DieModel[], player: Player) {
  const goes: Go[] = [];
  const iterator = iteratePossibleMoves(board, dice, player);
  for (const moves of iterator) {
    goes.push({ moves });
  }

  const maxNumberOfMoves = Math.max(...goes.map(({ moves }) => moves.length));
  return goes.filter(({ moves }) => moves.length === maxNumberOfMoves);
}

function getDestinationIndex(sourceIndex: number, dieValue: DieValue): number {
  return Math.max(sourceIndex - dieValue, OFF_POINT_INDEX);
}

export function getDistance(sourceIndex: number, destinationIndex: number) {
  return sourceIndex - destinationIndex;
}

export function getNextBoard(
  board: BoardModel,
  player: Player,
  sourceIndex: number,
  destinationIndex: number,
  checkerId?: string,
): BoardModel {
  return produce(board, (draftBoard) => {
    // If we've hit other player's blot, put it on the bar
    const otherPlayer = getOtherPlayer(player);
    const otherIndex = getOtherPlayersIndex(destinationIndex);
    const { checkerIds: otherPlayersCheckerIds } = draftBoard.points[otherPlayer][otherIndex];
    if (otherPlayersCheckerIds.length === 1) {
      const [blot] = otherPlayersCheckerIds.splice(0, 1);
      draftBoard.points[otherPlayer][BAR_POINT_INDEX].checkerIds.push(blot);

      draftBoard.pipCounts[otherPlayer] = getPipCount(draftBoard, otherPlayer);
    }

    // Move checker
    const { checkerIds: sourcePointCheckerIds } = draftBoard.points[player][sourceIndex];
    const checkerIndex =
      checkerId !== undefined ? sourcePointCheckerIds.findIndex((id) => id === checkerId) : 0;
    const [checker] = sourcePointCheckerIds.splice(checkerIndex, 1);
    draftBoard.points[player][destinationIndex].checkerIds.push(checker);

    draftBoard.pipCounts[player] = getPipCount(draftBoard, player);
  });
}

export function getPipCount(board: BoardModel, player: Player): number {
  return board.points[player]
    .map(({ checkerIds }, index) => checkerIds.length * index)
    .reduce((a, b) => a + b, 0);
}
