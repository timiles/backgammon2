import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderHandlers,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../colors';
import { CounterModel } from '../models/CounterModel';
import Player from '../models/Player';
import { RootState } from '../store';
import { BarIndexes } from '../store/Board';
import { moveCounter } from '../store/actions';
import styles from '../styles';
import { getDistance, getOtherPlayer } from '../utils';

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

  const canMove = (destinationIndex?: number) => {
    if (player !== currentPlayer) {
      return false;
    }

    const barIndex = BarIndexes[player];
    if (points[barIndex].counters.length > 0 && barIndex !== pointIndex) {
      // Player has counters on the bar, and this is not their bar
      return false;
    }

    if (destinationIndex != null) {
      if (destinationIndex === pointIndex) {
        // Can't move to the same point
        return false;
      }

      const otherPlayer = getOtherPlayer(player);
      if (points[destinationIndex].counters.filter((x) => x.player === otherPlayer).length > 1) {
        // Destination is blocked by other player
        return false;
      }

      const distance = getDistance(player, pointIndex, destinationIndex);
      if (!dice.some((x) => x.value === distance && x.remainingMoves > 0)) {
        // Don't have the dice roll available
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (canMove()) {
      const useNativeDriver = false;
      handlers = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderStart: () => {
          onSourceChange(true);
        },
        onPanResponderMove: Animated.event(
          [null, { dx: counterLocation.x, dy: counterLocation.y }],
          {
            useNativeDriver,
          },
        ),
        onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
          const { moveX, moveY } = gestureState;
          const destinationIndex = points
            .map((x) => x.box)
            .findIndex(
              (x) => x.left < moveX && moveX < x.right && x.top < moveY && moveY < x.bottom,
            );
          if (destinationIndex >= 0 && canMove(destinationIndex)) {
            dispatch(
              moveCounter({
                id,
                player,
                sourceIndex: pointIndex,
                destinationIndex,
                isLastMove: dice[0].remainingMoves + dice[1].remainingMoves === 1,
              }),
            );

            onSourceChange(false);
          } else {
            const config: Animated.SpringAnimationConfig = {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver,
            };
            Animated.spring(counterLocation, config).start(() => {
              onSourceChange(false);
            });
          }
        },
      }).panHandlers;
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
