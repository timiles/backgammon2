import { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { BoardEdge } from './BoardEdge';
import { CheckersArea } from './CheckersArea';
import { ControlsArea } from './ControlsArea';
import { Status } from './Status';
import { Player } from '../constants';
import { RootState } from '../store';
import { renderBoard } from '../store/actions';
import { styles } from '../styles';

export function GameContainer() {
  const { checkersAreaBox } = useSelector((state: RootState) => state.layout);
  const { board } = useSelector((state: RootState) => state.board.present);

  const dispatch = useDispatch();

  useEffect(() => {
    if (checkersAreaBox) {
      dispatch(renderBoard({ board }));
    }
  }, [checkersAreaBox]);

  return (
    <View style={styles.gameContainer}>
      <Status player={Player.Black} side="top" />
      <View style={styles.game}>
        <ControlsArea player={Player.Black} side="top" />
        <View style={styles.board}>
          <BoardEdge side="top" />
          <CheckersArea />
          <BoardEdge side="bottom" />
        </View>
        <ControlsArea player={Player.Red} side="bottom" />
      </View>
      <Status player={Player.Red} side="bottom" />
    </View>
  );
}
