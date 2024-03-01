import { Pressable, Text } from 'react-native';

import { Player } from '../constants';
import { DieModel } from '../models/DieModel';
import styles from '../styles';

interface IProps {
  player: Player;
  die?: DieModel;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Die(props: IProps) {
  const { player, die: dieModel, onPress, disabled } = props;
  const { value, remainingMoves } = dieModel || { value: '?', remainingMoves: 1 };

  const colorStyle = player === Player.Red ? styles.redDie : styles.blackDie;
  const disabledStyle = remainingMoves === 0 || disabled ? styles.disabledDie : null;
  const activeStyle = onPress && !disabled ? styles.activeDie : null;
  const style = [styles.die, colorStyle, disabledStyle, activeStyle];

  const die = (
    <Text style={style}>
      {value}
      {remainingMoves === 2 && <Text style={styles.doubleDieText}>×2</Text>}
    </Text>
  );
  return onPress && !disabled ? <Pressable onPress={onPress}>{die}</Pressable> : die;
}
