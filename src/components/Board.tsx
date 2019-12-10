import * as React from 'react';
import { View } from 'react-native';
import styles from '../styles';
import BoardHalf from './BoardHalf';

export default function Board() {
  return (
    <View style={styles.board}>
      <BoardHalf side="top" />
      <BoardHalf side="bottom" />
    </View>
  );
}
