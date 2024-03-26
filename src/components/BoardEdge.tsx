import { memo } from 'react';
import { View } from 'react-native';

import { PipCount } from './PipCount';
import { PointLabel } from './PointLabel';
import { BOARD_LAYOUT } from '../constants';
import { styles } from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export const BoardEdge = memo(function (props: IProps) {
  const { side } = props;

  const { leftHandPointIndexes, rightHandPointIndexes, offOwner } = BOARD_LAYOUT[side];

  return (
    <View style={[styles.boardEdge]}>
      {leftHandPointIndexes.map((i) => (
        <PointLabel key={i} pointIndex={i} side={side} />
      ))}
      <View style={[styles.boardSection, styles.boardColor]} />
      {rightHandPointIndexes.map((i) => (
        <PointLabel key={i} pointIndex={i} side={side} />
      ))}
      <PipCount owner={offOwner} side={side} />
    </View>
  );
});
