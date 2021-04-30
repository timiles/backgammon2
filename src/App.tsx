import * as React from 'react';
import { hot } from 'react-hot-loader';
import { View } from 'react-native';
import BoardHalf from './components/BoardHalf';
import ControlsArea from './components/ControlsArea';
import Status from './components/Status';
import Player from './models/Player';
import styles from './styles';

function App() {
  return (
    <View style={styles.app}>
      <Status player={Player.Black} side="top" />
      <View style={styles.game}>
        <ControlsArea player={Player.Black} side="top" />
        <View style={styles.board}>
          <BoardHalf side="top" />
          <BoardHalf side="bottom" />
        </View>
        <ControlsArea player={Player.Red} side="bottom" />
      </View>
      <Status player={Player.Red} side="bottom" />
    </View>
  );
}

export default hot(module)(App);
