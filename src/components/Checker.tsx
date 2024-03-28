import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../colors';
import { OFF_POINT_INDEX, Player } from '../constants';
import { Icon } from '../icons';
import { CheckerModel } from '../models';
import { RootState } from '../store';
import { moveChecker } from '../store/actions';
import { styles } from '../styles';
import { canMoveAnyChecker, canMoveChecker, getDistance, getNextBoard } from '../utils/boardUtils';
import { getNextDice } from '../utils/diceUtils';
import { getPlayersPointIndex } from '../utils/playerUtils';
import {
  createGestureResponderHandlers,
  findPointIndex,
  getOffBoardCheckerHeight,
  animateToLocation,
} from '../utils/uiUtils';

interface IProps extends CheckerModel {
  size: number;
}

export function Checker(props: IProps) {
  const { id, player, pointIndex, location, size } = props;

  // Use a counter, as checker could be moved again before it's finished returning to its location
  const [movingCounter, setMovingCounter] = useState(0);

  const board = useSelector((state: RootState) => state.board.present.board);
  const { checkersAreaBox } = useSelector((state: RootState) => state.layout);
  const dice = useSelector((state: RootState) => state.dice.present.dice[player]);
  const currentPlayer = useSelector((state: RootState) => state.player.present.currentPlayer);

  const canMove = player === currentPlayer && canMoveChecker(board, dice, player, pointIndex);

  const dispatch = useDispatch();

  const checkerLocation = useRef(new Animated.ValueXY(location)).current;
  const [gestureResponderHandlers, setGestureResponderHandlers] =
    useState<GestureResponderHandlers | null>();

  useEffect(() => {
    animateToLocation(checkerLocation, location);
  }, [location]);

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (canMove) {
      const getDestinationId = (x: number, y: number) => {
        if (checkersAreaBox) {
          const index = findPointIndex(checkersAreaBox, x, y);
          if (index !== null) {
            return getPlayersPointIndex(player, index);
          }
        }
        return null;
      };

      const canMoveToDestination = (destinationIndex: number) =>
        destinationIndex >= 0 && canMoveChecker(board, dice, player, pointIndex, destinationIndex);

      const handleMoveStart = () => setMovingCounter((prev) => prev + 1);

      const handleMoveSuccess = (destinationIndex: number) => {
        const distance = getDistance(pointIndex, destinationIndex);
        const nextDice = getNextDice(dice, distance);
        const nextBoard = getNextBoard(board, player, pointIndex, destinationIndex, id);

        const playerCanMoveAgain = canMoveAnyChecker(nextBoard, nextDice, player);

        dispatch(
          moveChecker({
            player,
            nextBoard,
            nextDice,
            playerCanMoveAgain,
          }),
        );
      };

      const handleMoveEnd = () => setMovingCounter((prev) => prev - 1);

      handlers = createGestureResponderHandlers(
        location,
        getDestinationId,
        canMoveToDestination,
        checkerLocation,
        handleMoveStart,
        handleMoveSuccess,
        handleMoveEnd,
      );
    }

    setGestureResponderHandlers(handlers);
  }, [currentPlayer, board, checkersAreaBox, dice, location, pointIndex]);

  const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;
  const canMoveStyle = canMove ? styles.moveableChecker : null;
  const isMovingStyle = movingCounter > 0 ? styles.movingChecker : null;
  const checkerLocationStyle = { transform: checkerLocation.getTranslateTransform() };
  const checkerStyle = [styles.checker, canMoveStyle, isMovingStyle, checkerLocationStyle];

  const isOffBoard = pointIndex === OFF_POINT_INDEX;
  const height =
    isOffBoard && checkersAreaBox ? getOffBoardCheckerHeight(checkersAreaBox.height) : undefined;

  return (
    <Animated.View style={checkerStyle} {...gestureResponderHandlers}>
      <Icon
        type={isOffBoard ? 'OffChecker' : 'Checker'}
        width={size}
        height={height}
        fill={color}
      />
    </Animated.View>
  );
}
