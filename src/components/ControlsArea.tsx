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

export default function ControlsArea(props: IProps) {
  const { player, side } = props;
  return (
    <View style={[styles.controlsArea, side === 'top' ? styles.upsideDown : null]}>
      <View style={styles.diceRollArea}>
        <Dice player={player} />
      </View>
    </View>
  );
}
