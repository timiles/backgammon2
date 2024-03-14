import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Player } from '../constants';
import useScreenSize from '../hooks/useScreenSize';
import { RootState } from '../store';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  player: Player;
  side: Side;
}

export default function Status(props: IProps) {
  const { player, side } = props;

  const { isSmall } = useScreenSize();

  const status = useSelector((state: RootState) => state.statuses.present.statuses[player]);

  const colorStyle = player === Player.Red ? styles.redPlayer : styles.blackPlayer;
  const smallStyle = isSmall ? styles.smallStatusText : null;
  const textStyle = [styles.statusText, colorStyle, smallStyle];

  const topBottomStyle = side === 'top' ? styles.upsideDown : null;

  return (
    <View style={topBottomStyle}>
      <Text style={textStyle}>
        <Text style={styles.playerText}>{status && `${Player[player].toUpperCase()}: `}</Text>
        {status || ' '}
      </Text>
    </View>
  );
}
