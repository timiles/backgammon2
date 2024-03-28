import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../colors';
import { Player } from '../constants';
import { Icon } from '../icons';
import { RootState } from '../store';
import { moveChecker } from '../store/actions';
import { styles } from '../styles';
import { canMoveAnyChecker, canMoveChecker, getDistance, getNextBoard } from '../utils/boardUtils';
import { getNextDice } from '../utils/diceUtils';
import { getPlayersPointIndex } from '../utils/playerUtils';
import { createGestureResponderHandlers, findPointIndex } from '../utils/uiUtils';

interface IProps {
  checkerId: string;
  player: Player;
  pointIndex: number;
  onMoving: (isMoving: boolean) => void;
  size: number;
}

export function Checker(props: IProps) {
  const { checkerId, player, pointIndex, onMoving, size } = props;

  const board = useSelector((state: RootState) => state.board.present.board);
  const { checkersAreaBox } = useSelector((state: RootState) => state.layout);
  const dice = useSelector((state: RootState) => state.dice.present.dice[player]);
  const currentPlayer = useSelector((state: RootState) => state.player.present.currentPlayer);

  const dispatch = useDispatch();

  const checkerLocation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [gestureResponderHandlers, setGestureResponderHandlers] =
    useState<GestureResponderHandlers | null>();

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (player === currentPlayer && canMoveChecker(board, dice, player, pointIndex)) {
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

      const handleMoveStart = () => onMoving(true);

      const handleMoveSuccess = (destinationIndex: number) => {
        const distance = getDistance(pointIndex, destinationIndex);
        const nextDice = getNextDice(dice, distance);
        const nextBoard = getNextBoard(board, player, pointIndex, destinationIndex, checkerId);

        const playerCanMoveAgain = canMoveAnyChecker(nextBoard, nextDice, player);

        dispatch(moveChecker({ player, nextBoard, nextDice, playerCanMoveAgain }));
      };

      const handleMoveEnd = () => onMoving(false);

      handlers = createGestureResponderHandlers(
        getDestinationId,
        canMoveToDestination,
        checkerLocation,
        handleMoveStart,
        handleMoveSuccess,
        handleMoveEnd,
      );
    }

    setGestureResponderHandlers(handlers);
  }, [currentPlayer, board, checkersAreaBox, dice]);

  const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;
  const checkerLocationStyle = { transform: checkerLocation.getTranslateTransform() };
  const checkerStyle = [styles.checker, checkerLocationStyle];

  return (
    <Animated.View style={checkerStyle} {...gestureResponderHandlers}>
      <Icon type="Checker" width={size} fill={color} />
    </Animated.View>
  );
}
