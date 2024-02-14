import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../colors';
import { CounterModel } from '../models/CounterModel';
import Player from '../models/Player';
import { RootState } from '../store';
import { moveCounter } from '../store/actions';
import styles from '../styles';
import { canMoveCounter, createGestureResponderHandlers, findDestinationIndex } from '../utils';

interface IProps extends CounterModel {
  pointIndex: number;
  onSourceChange: (isSource: boolean) => void;
  size: number;
}

export default function Counter(props: IProps) {
  const { id, player, pointIndex, onSourceChange, size } = props;

  const points = useSelector((state: RootState) => state.board.present.points);
  const dice = useSelector((state: RootState) => state.dice.present.dice[player]);
  const currentPlayer = useSelector((state: RootState) => state.player.present.currentPlayer);

  const dispatch = useDispatch();

  const counterLocation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [gestureResponderHandlers, setGestureResponderHandlers] =
    useState<GestureResponderHandlers | null>();

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (player === currentPlayer && canMoveCounter(player, dice, points, pointIndex)) {
      const findDestinationId = (x: number, y: number) => findDestinationIndex(points, x, y);

      const canMoveToDestination = (destinationIndex: number) =>
        destinationIndex >= 0 && canMoveCounter(player, dice, points, pointIndex, destinationIndex);

      const handleMoveStart = () => onSourceChange(true);

      const handleMoveSuccess = (destinationIndex: number) => {
        dispatch(
          moveCounter({
            id,
            player,
            sourceIndex: pointIndex,
            destinationIndex,
            isLastMove: dice[0].remainingMoves + dice[1].remainingMoves === 1,
          }),
        );
      };

      const handleMoveEnd = () => onSourceChange(false);

      handlers = createGestureResponderHandlers(
        findDestinationId,
        canMoveToDestination,
        counterLocation,
        handleMoveStart,
        handleMoveSuccess,
        handleMoveEnd,
      );
    }

    setGestureResponderHandlers(handlers);
  }, [currentPlayer, points, dice]);

  const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;
  const counterLocationStyle = { transform: counterLocation.getTranslateTransform() };
  const counterStyle = [styles.counter, counterLocationStyle];

  return (
    <Animated.View style={counterStyle} {...gestureResponderHandlers}>
      <svg viewBox="0 0 100 100" width={size} xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill={color} />
      </svg>
    </Animated.View>
  );
}
