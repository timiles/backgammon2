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

  // Top side:    12|13|14|15|16|17|bar|18|19|20|21|22|23
  // Bottom side: 11|10| 9| 8| 7| 6|bar| 5| 4| 3| 2| 1| 0
  const { startingPointIndex, direction, barOwner } =
    side === 'top'
      ? { startingPointIndex: 12, direction: 1, barOwner: Player.Red }
      : { startingPointIndex: 11, direction: -1, barOwner: Player.Black };

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
