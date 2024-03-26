import { memo } from 'react';
import { View, Text } from 'react-native';

import { Player } from '../constants';
import { useScreenSize } from '../hooks';
import { styles } from '../styles';
import { Side } from '../types';
import { getPlayersPointIndex } from '../utils/playerUtils';

interface IProps {
  pointIndex: number;
  side: Side;
}

export const PointLabel = memo(function (props: IProps) {
  const { pointIndex, side } = props;

  const { isSmall } = useScreenSize();

  const containerStyle =
    side === 'top' ? styles.topPointLabelContainer : styles.bottomPointLabelContainer;

  return (
    <View style={[styles.boardSection, styles.boardColor, containerStyle]}>
      <View style={styles.pointLabelContainer}>
        <Text style={[styles.pointLabel, styles.redPlayer]}>
          {getPlayersPointIndex(Player.Red, pointIndex)}
        </Text>
        {!isSmall && (
          <Text style={[styles.pointLabel, styles.blackPlayer, styles.upsideDown]}>
            {getPlayersPointIndex(Player.Black, pointIndex)}
          </Text>
        )}
      </View>
    </View>
  );
});
