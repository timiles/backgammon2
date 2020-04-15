import * as React from 'react';
import { hot } from 'react-hot-loader';
import { View } from 'react-native';
import Board from './components/Board';
import DiceRollArea from './components/DiceRollArea';
import Status from './components/Status';
import Player from './models/Player';
import styles from './styles';

function App() {
  return (
    <View style={styles.app}>
      <Status player={Player.Black} upsideDown />
      <View style={styles.game}>
        <DiceRollArea player={Player.Black} upsideDown />
        <Board />
        <DiceRollArea player={Player.Red} />
      </View>
      <Status player={Player.Red} />
    </View>
  );
}

export default hot(module)(App);
