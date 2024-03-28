import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Player } from '../constants';
import { useScreenSize } from '../hooks';
import { RootState } from '../store';
import { styles } from '../styles';
import { Side } from '../types';

interface IProps {
  owner: Player;
  side: Side;
}

export function PipCount(props: IProps) {
  const { owner, side } = props;

  const { isSmall } = useScreenSize();

  const pipCount = useSelector((state: RootState) => state.board.present.board.pipCounts[owner]);

  const labelStyle = [
    side === 'top' ? styles.upsideDown : null,
    owner === Player.Red ? styles.redPlayer : styles.blackPlayer,
  ];

  return (
    <View style={[styles.boardSection, styles.boardColor]}>
      {!isSmall && <Text style={[styles.pipCountLabel, labelStyle]}>{pipCount}</Text>}
    </View>
  );
}
