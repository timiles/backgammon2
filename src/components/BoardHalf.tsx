import { View } from 'react-native';

import { Bar } from './Bar';
import { OffBoard } from './OffBoard';
import { Point } from './Point';
import { BOARD_LAYOUT } from '../constants';
import { useMovingCheckerSourceStyle } from '../hooks';
import { styles } from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export function BoardHalf(props: IProps) {
  const { side } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } = useMovingCheckerSourceStyle();

  const { leftHandPointIndexes, rightHandPointIndexes, barOwner, offOwner } = BOARD_LAYOUT[side];

  return (
    <View style={[styles.boardHalf, movingCheckerSourceStyle]}>
      {leftHandPointIndexes.map((i) => (
        <Point key={i} redIndex={i} side={side} onCheckerMoving={handleCheckerMoving} />
      ))}
      <Bar owner={barOwner} onCheckerMoving={handleCheckerMoving} />
      {rightHandPointIndexes.map((i) => (
        <Point key={i} redIndex={i} side={side} onCheckerMoving={handleCheckerMoving} />
      ))}
      <OffBoard owner={offOwner} side={side} />
    </View>
  );
}
