import { memo } from 'react';
import { View } from 'react-native';

import { styles } from '../styles';

interface IProps {
  pointIndex: number;
}

export const Point = memo(function (props: IProps) {
  const { pointIndex } = props;

  const colorStyle = pointIndex % 2 === 0 ? styles.evenPointColor : styles.oddPointColor;

  return <View style={[styles.boardSection, colorStyle]} />;
});
