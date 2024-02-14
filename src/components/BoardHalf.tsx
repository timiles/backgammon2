import { useState } from 'react';
import { View } from 'react-native';

import Home from './Home';
import Point from './Point';
import Player from '../models/Player';
import { BarIndexes } from '../store/Board';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export default function BoardHalf(props: IProps) {
  const { side } = props;

  const [sourceCount, setSourceCount] = useState(0);

  const handleSourceChange = (isSource: boolean) => {
    // Increment or decrement sourceCount, to handle asynchronous UI updates correctly
    setSourceCount((prevSourceCount) => prevSourceCount + (isSource ? 1 : -1));
  };

  // Top side:    12|11|10| 9| 8| 7|bar (0)| 6| 5| 4| 3| 2| 1
  // Bottom side: 13|14|15|16|17|18|bar(24)|19|20|21|22|23|24
  const startingPointIndex = side === 'top' ? 12 : 13;
  const direction = side === 'top' ? -1 : 1;
  const barIndex = BarIndexes[side === 'top' ? Player.Red : Player.Black];

  const sourceStyle = sourceCount > 0 ? styles.draggableSource : null;

  const leftHandPoints: JSX.Element[] = [];
  const rightHandPoints: JSX.Element[] = [];
  for (let i = 0; i < 6; i += 1) {
    const pointIndex = startingPointIndex + i * direction;
    leftHandPoints.push(
      <Point
        key={i}
        type="Point"
        index={pointIndex}
        side={side}
        onSourceChange={handleSourceChange}
      />,
    );
    rightHandPoints.push(
      <Point
        key={i}
        type="Point"
        index={pointIndex + 6 * direction}
        side={side}
        onSourceChange={handleSourceChange}
      />,
    );
  }

  return (
    <View style={[styles.boardHalf, sourceStyle]}>
      {leftHandPoints}
      <Point type="Bar" index={barIndex} side={side} onSourceChange={handleSourceChange} />
      {rightHandPoints}
      <Home />
    </View>
  );
}
