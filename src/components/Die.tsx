import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Player } from '../constants';
import { styles } from '../styles';
import { DieValue } from '../types';

interface IProps {
  player: Player;
  value: DieValue | undefined;
  remainingMoves: number | undefined;
  onPress?: () => void;
  disabled?: boolean;
}

export const Die = memo(function (props: IProps) {
  const { player, value = '?', remainingMoves = 1, onPress, disabled } = props;

  const colorStyle = player === Player.Red ? styles.redDie : styles.blackDie;
  const disabledStyle = remainingMoves === 0 || disabled ? styles.disabledDie : null;
  const activeStyle = onPress && !disabled ? styles.activeDie : null;
  const viewStyle = [styles.die, colorStyle, disabledStyle, activeStyle];

  const die = (
    <View style={viewStyle}>
      <Text style={styles.dieText}>
        {value}
        {remainingMoves === 2 && <Text style={styles.doubleDieText}>×2</Text>}
      </Text>
    </View>
  );
  return onPress && !disabled ? <Pressable onPress={onPress}>{die}</Pressable> : die;
});
