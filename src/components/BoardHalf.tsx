import { View } from 'react-native';

import Bar from './Bar';
import OffBoard from './OffBoard';
import Point from './Point';
import { Player } from '../constants';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  side: Side;
}

export default function BoardHalf(props: IProps) {
  const { side } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } = useMovingCheckerSourceStyle();

  // Top side:    13|14|15|16|17|18|25|19|20|21|22|23|24|
  // Bottom side: 12|11|10| 9| 8| 7|  | 6| 5| 4| 3| 2| 1|
  const { startingPointIndex, direction, barOwner, offOwner } =
    side === 'top'
      ? { startingPointIndex: 13, direction: 1, barOwner: Player.Red, offOwner: Player.Black }
      : { startingPointIndex: 12, direction: -1, barOwner: Player.Black, offOwner: Player.Red };

  const leftHandPoints: JSX.Element[] = [];
  const rightHandPoints: JSX.Element[] = [];
  for (let i = 0; i < 6; i += 1) {
    const leftHandPointIndex = startingPointIndex + i * direction;
    const rightHandPointIndex = leftHandPointIndex + 6 * direction;
    leftHandPoints.push(
      <Point
        key={i}
        redIndex={leftHandPointIndex}
        side={side}
        onCheckerMoving={handleCheckerMoving}
      />,
    );
    rightHandPoints.push(
      <Point
        key={i}
        redIndex={rightHandPointIndex}
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
      <OffBoard owner={offOwner} side={side} />
    </View>
  );
}
