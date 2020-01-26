import * as React from 'react';
import { View } from 'react-native';
import Player from '../models/Player';
import styles from '../styles';
import Dice from './Dice';

interface IProps {
  player: Player;
  upsideDown?: boolean;
}

export default function DiceRollArea(props: IProps) {
  const { player, upsideDown } = props;
  return (
    <View style={[styles.diceRollArea, upsideDown ? styles.upsideDown : null]}>
      <Dice player={player} />
    </View>
  );
}
