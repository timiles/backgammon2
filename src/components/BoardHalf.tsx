import { memo } from 'react';
import { View } from 'react-native';

import { Bar } from './Bar';
import { OffBoard } from './OffBoard';
import { Point } from './Point';
import { BOARD_LAYOUT } from '../constants';
import { styles } from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export const BoardHalf = memo(function (props: IProps) {
  const { side } = props;

  const { leftHandPointIndexes, rightHandPointIndexes } = BOARD_LAYOUT[side];

  return (
    <View style={[styles.boardHalf]}>
      {leftHandPointIndexes.map((i) => (
        <Point key={i} pointIndex={i} />
      ))}
      <Bar />
      {rightHandPointIndexes.map((i) => (
        <Point key={i} pointIndex={i} />
      ))}
      <OffBoard />
    </View>
  );
});
