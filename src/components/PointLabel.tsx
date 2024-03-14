import { View, Text } from 'react-native';

import { styles } from '../styles';
import { Side } from '../types';
import { getOtherPlayersIndex } from '../utils';

interface IProps {
  redIndex: number;
  side: Side;
}

export function PointLabel(props: IProps) {
  const { redIndex, side } = props;

  const containerStyle =
    side === 'top' ? styles.topPointLabelContainer : styles.bottomPointLabelContainer;

  return (
    <View style={[styles.pointLabelContainer, containerStyle]}>
      <Text style={[styles.pointLabel, styles.redPlayer]}>{redIndex}</Text>
      <Text style={[styles.pointLabel, styles.blackPlayer, styles.upsideDown]}>
        {getOtherPlayersIndex(redIndex)}
      </Text>
    </View>
  );
}
