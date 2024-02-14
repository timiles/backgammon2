import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import Player from '../models/Player';
import { RootState } from '../store';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  player: Player;
  side: Side;
}

export default function Status(props: IProps) {
  const { player, side } = props;

  const status = useSelector((state: RootState) => state.statuses.present.statuses[player]);

  const colorStyle = player === Player.Red ? styles.redPlayer : styles.blackPlayer;

  return (
    <View style={side === 'top' ? styles.upsideDown : null}>
      <Text style={[styles.statusText, colorStyle]}>
        <Text style={styles.playerText}>{status && `${Player[player].toUpperCase()}: `}</Text>
        {status || ' '}
      </Text>
    </View>
  );
}
