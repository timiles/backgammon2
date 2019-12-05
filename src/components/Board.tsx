import * as React from 'react';
import { View } from 'react-native';
import styles from '../styles';
import Bar from './Bar';
import Home from './Home';
import Point from './Point';

export default function Board() {
  return (
    <>
      <View style={styles.board}>
        <View style={styles.boardHalf}>
          <Point number={12} />
          <Point number={11} />
          <Point number={10} />
          <Point number={9} />
          <Point number={8} />
          <Point number={7} />
          <Bar />
          <Point number={6} />
          <Point number={5} />
          <Point number={4} />
          <Point number={3} />
          <Point number={2} />
          <Point number={1} />
          <Home />
        </View>
        <View style={styles.boardHalf}>
          <Point number={13} />
          <Point number={14} />
          <Point number={15} />
          <Point number={16} />
          <Point number={17} />
          <Point number={18} />
          <Bar />
          <Point number={19} />
          <Point number={20} />
          <Point number={21} />
          <Point number={22} />
          <Point number={23} />
          <Point number={24} />
          <Home />
        </View>
      </View>
    </>
  );
}
