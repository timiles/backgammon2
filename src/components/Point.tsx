import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Checker from './Checker';
import { PointLabel } from './PointLabel';
import useCheckerContainerBox from '../hooks/useCheckerContainerBox';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import Player from '../models/Player';
import { RootState } from '../store';
import styles from '../styles';
import { Side } from '../types';
import { getCheckerSize, getOtherPlayersIndex } from '../utils';

interface IProps {
  redIndex: number;
  side: Side;
  onCheckerMoving: (isMoving: boolean) => void;
}

export default function Point(props: IProps) {
  const { redIndex, side, onCheckerMoving } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } =
    useMovingCheckerSourceStyle(onCheckerMoving);

  const { ref, dimensions } = useCheckerContainerBox(redIndex);

  const { points } = useSelector((state: RootState) => state.board.present.board);

  const blackIndex = getOtherPlayersIndex(redIndex);

  const { player, index } =
    points[Player.Red][redIndex].checkers.length > 0
      ? { player: Player.Red, index: redIndex }
      : { player: Player.Black, index: blackIndex };

  const { checkers } = points[player][index];

  const checkerSize = dimensions ? getCheckerSize(dimensions, checkers.length) : undefined;

  const colorStyle = redIndex % 2 === 0 ? styles.evenPointColor : styles.oddPointColor;
  const pointContainerStyle =
    side === 'top' ? styles.topPointContainer : styles.bottomPointContainer;
  const checkerContainerStyle =
    side === 'top' ? styles.topPointCheckerContainer : styles.bottomPointCheckerContainer;

  return (
    <View style={[styles.boardSection, colorStyle, pointContainerStyle, movingCheckerSourceStyle]}>
      <PointLabel redIndex={redIndex} side={side} />
      <View
        ref={ref}
        style={[styles.checkerContainer, checkerContainerStyle, movingCheckerSourceStyle]}
      >
        {checkerSize !== undefined &&
          checkers.map(({ id }) => (
            <Checker
              key={id}
              checkerId={id}
              player={player}
              index={index}
              onMoving={handleCheckerMoving}
              size={checkerSize}
            />
          ))}
      </View>
    </View>
  );
}
