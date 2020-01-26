import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { DieValue } from '../models/DieValue';
import Player from '../models/Player';
import styles from '../styles';

interface IProps {
  player: Player;
  value: DieValue | '?';
  isSpent?: boolean;
  onPress?: () => void;
}

export default function Die(props: IProps) {
  const {
    player,
    value,
    isSpent,
    onPress,
  } = props;

  const colorStyle = player === Player.Red ? styles.redDie : styles.blackDie;
  const spentStyle = isSpent ? styles.spentDie : null;
  const activeStyle = onPress ? styles.activeDie : null;
  const style = [styles.die, colorStyle, spentStyle, activeStyle];

  const die = <Text style={style} selectable={false}>{value}</Text>;
  return onPress ? <TouchableOpacity onPress={onPress}>{die}</TouchableOpacity> : die;
}
