import * as React from 'react';
import { Text, View } from 'react-native';
import { PlayerId } from '../models/PlayerId';
import styles from '../styles';

interface IProps {
  playerId: PlayerId;
}

export default function DiceRollArea(props: IProps) {
  const { playerId } = props;
  const rotation = playerId === 2 ? styles.player2Rotation : null;
  return (
    <View style={[styles.diceRollArea, rotation]}>
      <Text>TODO: dice roll area</Text>
    </View>
  );
}
