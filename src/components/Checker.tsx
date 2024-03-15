import { useEffect, useRef, useState } from 'react';
import { Animated, GestureResponderHandlers } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../colors';
import { Player } from '../constants';
import { Icon } from '../icons';
import { RootState } from '../store';
import { moveChecker } from '../store/actions';
import { styles } from '../styles';
import {
  canMoveAnyChecker,
  canMoveChecker,
  createGestureResponderHandlers,
  findDestinationIndex,
  getDistance,
  getNextBoard,
  getNextDice,
} from '../utils';

interface IProps {
  checkerId: string;
  player: Player;
  index: number;
  onMoving: (isMoving: boolean) => void;
  size: number;
}

export function Checker(props: IProps) {
  const { checkerId, player, index, onMoving, size } = props;

  const board = useSelector((state: RootState) => state.board.present.board);
  const boxes = useSelector((state: RootState) => state.layout.boxes);
  const dice = useSelector((state: RootState) => state.dice.present.dice[player]);
  const currentPlayer = useSelector((state: RootState) => state.player.present.currentPlayer);

  const dispatch = useDispatch();

  const checkerLocation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [gestureResponderHandlers, setGestureResponderHandlers] =
    useState<GestureResponderHandlers | null>();

  useEffect(() => {
    let handlers: GestureResponderHandlers | null = null;

    if (player === currentPlayer && canMoveChecker(board, dice, player, index)) {
      const findDestinationId = (x: number, y: number) => findDestinationIndex(player, boxes, x, y);

      const canMoveToDestination = (destinationIndex: number) =>
        destinationIndex >= 0 && canMoveChecker(board, dice, player, index, destinationIndex);

      const handleMoveStart = () => onMoving(true);

      const handleMoveSuccess = (destinationIndex: number) => {
        const distance = getDistance(index, destinationIndex);
        const nextDice = getNextDice(dice, distance);
        const nextBoard = getNextBoard(board, player, index, destinationIndex, checkerId);

        const playerCanMoveAgain = canMoveAnyChecker(nextBoard, nextDice, player);

        dispatch(moveChecker({ player, nextBoard, nextDice, playerCanMoveAgain }));
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
  }, [currentPlayer, board, boxes, dice]);

  const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;
  const checkerLocationStyle = { transform: checkerLocation.getTranslateTransform() };
  const checkerStyle = [styles.checker, checkerLocationStyle];

  return (
    <Animated.View style={checkerStyle} {...gestureResponderHandlers}>
      <Icon type="Checker" width={size} fill={color} />
    </Animated.View>
  );
}
