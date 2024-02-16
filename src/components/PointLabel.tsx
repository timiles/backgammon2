import { View, Text } from 'react-native';

import styles from '../styles';
import { Side } from '../types';

interface IProps {
  index: number;
  side: Side;
}

export function PointLabel(props: IProps) {
  const { index, side } = props;

  const containerStyle =
    side === 'top' ? styles.topPointLabelContainer : styles.bottomPointLabelContainer;

  return (
    <View style={[styles.pointLabelContainer, containerStyle]}>
      <Text style={[styles.pointLabel, styles.redPlayer]}>{index}</Text>
      <Text style={[styles.pointLabel, styles.blackPlayer, styles.upsideDown]}>{25 - index}</Text>
    </View>
  );
}
