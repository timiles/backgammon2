import * as React from 'react';
import { View } from 'react-native';
import Board from './components/Board';
import DiceRollArea from './components/DiceRollArea';
import styles from './styles';

export default function App() {
  return (
    <View style={styles.app}>
      <Board />
      <DiceRollArea />
    </View>
  );
}
