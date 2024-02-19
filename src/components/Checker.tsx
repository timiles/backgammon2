import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../colors';
import { CheckerModel } from '../models/CheckerModel';
import Player from '../models/Player';
import { RootState } from '../store';
import { moveChecker } from '../store/actions';
import styles from '../styles';
import { CheckerSourceIndex } from '../types';
import { canMoveChecker, createGestureResponderHandlers, findDestinationIndex } from '../utils';

interface IProps extends CheckerModel {
  index: CheckerSourceIndex;
  onMoving: (isMoving: boolean) => void;
  size: number;
}

export default function Checker(props: IProps) {
  const { id, player, index, onMoving, size } = props;

  const board = useSelector((state: RootState) => state.board.present.board);
  const dice = useSelector((state: RootState) => state.dice.present.dice[player]);
  const currentPlayer = useSelector((state: RootState) => state.player.present.currentPlayer);

  const dispatch = useDispatch();

  const checkerLocation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [gestureResponderHandlers, setGestureResponderHandlers] =
    useState<GestureResponderHandlers | null>();

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (player === currentPlayer && canMoveChecker(player, dice, board, index)) {
      const findDestinationId = (x: number, y: number) => findDestinationIndex(board.points, x, y);

      const canMoveToDestination = (destinationIndex: number) =>
        destinationIndex >= 0 && canMoveChecker(player, dice, board, index, destinationIndex);

      const handleMoveStart = () => onMoving(true);

      const handleMoveSuccess = (destinationIndex: number) => {
        dispatch(
          moveChecker({
            id,
            player,
            sourceIndex: index,
            destinationIndex,
            isLastMove: dice[0].remainingMoves + dice[1].remainingMoves === 1,
          }),
        );
      };

      const handleMoveEnd = () => onMoving(false);

      handlers = createGestureResponderHandlers(
        findDestinationId,
        canMoveToDestination,
        checkerLocation,
        handleMoveStart,
        handleMoveSuccess,
        handleMoveEnd,
      );
    }

    setGestureResponderHandlers(handlers);
  }, [currentPlayer, board, dice]);

  const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;
  const checkerLocationStyle = { transform: checkerLocation.getTranslateTransform() };
  const checkerStyle = [styles.checker, checkerLocationStyle];

  return (
    <Animated.View style={checkerStyle} {...gestureResponderHandlers}>
      <svg viewBox="0 0 100 100" width={size} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill={color} />
      </svg>
    </Animated.View>
  );
}