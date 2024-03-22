import { View } from 'react-native';

import { BoardHalf } from './BoardHalf';
import { ControlsArea } from './ControlsArea';
import { Status } from './Status';
import { Player } from '../constants';
import { styles } from '../styles';

export function GameContainer() {
  return (
    <View style={styles.gameContainer}>
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
