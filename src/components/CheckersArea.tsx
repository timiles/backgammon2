import { RefObject, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BoardHalf } from './BoardHalf';
import { BoxModel } from '../models';
import { registerCheckersAreaBox } from '../store/actions';
import { styles } from '../styles';

export function CheckersArea() {
  const dispatch = useDispatch();

  const ref = useRef<View>() as RefObject<View>;

  const handleLayout = () => {
    // The (event: LayoutChangeEvent) argument has x/y relative to parent element -
    // measure the referenced element instead as it gives us absolute pageX/pageY
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      const box: BoxModel = { pageX, pageY, width, height };

      dispatch(registerCheckersAreaBox({ box }));
    });
  };

  return (
    <View style={styles.boardSection} ref={ref} onLayout={handleLayout}>
      <BoardHalf side="top" />
      <BoardHalf side="bottom" />
    </View>
  );
}
