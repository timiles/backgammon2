import * as React from 'react';
import { View } from 'react-native';
import Board from './components/Board';
import DiceRollArea from './components/DiceRollArea';
import Status from './components/Status';
import styles from './styles';

export default function App() {
  return (
    <View style={styles.app}>
      <Status playerId={2} />
      <View style={styles.game}>
        <DiceRollArea playerId={2} />
        <Board />
        <DiceRollArea playerId={1} />
      </View>
      <Status playerId={1} />
    </View>
  );
}
