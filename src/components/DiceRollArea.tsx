import * as React from 'react';
import { Text, View } from 'react-native';
import Player from '../models/Player';
import styles from '../styles';

interface IProps {
  player: Player;
  upsideDown?: boolean;
}

export default function DiceRollArea(props: IProps) {
  const { upsideDown } = props;
  return (
    <View style={[styles.diceRollArea, upsideDown ? styles.upsideDown : null]}>
      <Text>TODO: dice roll area</Text>
    </View>
  );
}
