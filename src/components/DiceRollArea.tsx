import * as React from 'react';
import { View } from 'react-native';
import Player from '../models/Player';
import styles from '../styles';
import { Side } from '../types';
import Dice from './Dice';

interface IProps {
  player: Player;
  side: Side;
}

export default function DiceRollArea(props: IProps) {
  const { player, side } = props;
  return (
    <View style={[styles.diceRollArea, side === 'top' ? styles.upsideDown : null]}>
      <Dice player={player} />
    </View>
  );
}
