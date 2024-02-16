import { View } from 'react-native';

import Bar from './Bar';
import Home from './Home';
import Point from './Point';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import Player from '../models/Player';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export default function BoardHalf(props: IProps) {
  const { side } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } = useMovingCheckerSourceStyle();

  // Top side:    13|14|15|16|17|18|bar(25)|19|20|21|22|23|24
  // Bottom side: 12|11|10| 9| 8| 7|bar (0)| 6| 5| 4| 3| 2| 1
  const { startingPointIndex, direction, barOwner } =
    side === 'top'
      ? { startingPointIndex: 13, direction: 1, barOwner: Player.Red }
      : { startingPointIndex: 12, direction: -1, barOwner: Player.Black };

  const leftHandPoints: JSX.Element[] = [];
  const rightHandPoints: JSX.Element[] = [];
  for (let i = 0; i < 6; i += 1) {
    const leftHandPointIndex = startingPointIndex + i * direction;
    const rightHandPointIndex = leftHandPointIndex + 6 * direction;
    leftHandPoints.push(
      <Point
        key={i}
        index={leftHandPointIndex}
        side={side}
        onCheckerMoving={handleCheckerMoving}
      />,
    );
    rightHandPoints.push(
      <Point
        key={i}
        index={rightHandPointIndex}
        side={side}
        onCheckerMoving={handleCheckerMoving}
      />,
    );
  }

  return (
    <View style={[styles.boardHalf, movingCheckerSourceStyle]}>
      {leftHandPoints}
      <Bar owner={barOwner} onCheckerMoving={handleCheckerMoving} />
      {rightHandPoints}
      <Home />
    </View>
  );
}
