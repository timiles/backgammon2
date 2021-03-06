import * as React from 'react';
import { View } from 'react-native';
import Player from '../models/Player';
import styles from '../styles';
import { Side } from '../types';
import Dice from './Dice';
import RedoButton from './RedoButton';
import UndoButton from './UndoButton';

interface IProps {
  player: Player;
  side: Side;
}

export default function ControlsArea(props: IProps) {
  const { player, side } = props;
  return (
    <View style={[styles.controlsArea, side === 'top' ? styles.upsideDown : null]}>
      <View style={styles.controlContainer}>
        <RedoButton player={player} />
      </View>
      <View style={styles.controlContainer}>
        <UndoButton player={player} />
      </View>
      <View style={styles.diceRollArea}>
        <Dice player={player} />
      </View>
    </View>
  );
}
