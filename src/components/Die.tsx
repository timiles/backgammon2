import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { DieModel } from '../models/DieModel';
import Player from '../models/Player';
import styles from '../styles';

interface IProps {
  player: Player;
  die?: DieModel;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Die(props: IProps) {
  const { player, die: dieModel, onPress, disabled } = props;
  const { value, isHalfSpent = false, isSpent = false } = dieModel || { value: '?' };

  const colorStyle = player === Player.Red ? styles.redDie : styles.blackDie;
  // eslint-disable-next-line no-nested-ternary
  const spentStyle = isSpent ? styles.spentDie : isHalfSpent ? styles.halfSpentDie : null;
  const disabledStyle = disabled ? styles.spentDie : null;
  const activeStyle = onPress ? styles.activeDie : null;
  const style = [styles.die, colorStyle, spentStyle, disabledStyle, activeStyle];

  const die = <Text style={style} selectable={false}>{value}</Text>;
  return onPress ? <TouchableOpacity onPress={onPress}>{die}</TouchableOpacity> : die;
}
