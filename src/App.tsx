import { View } from 'react-native';

import { BoardHalf, ControlsArea, Status } from './components';
import { Player } from './constants';
import { styles } from './styles';

export function App() {
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
