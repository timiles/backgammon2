import { View } from 'react-native';

import CheckerContainer from './CheckerContainer';
import { PointLabel } from './PointLabel';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  index: number;
  side: Side;
  onCheckerMoving: (isMoving: boolean) => void;
}

export default function Point(props: IProps) {
  const { index, side, onCheckerMoving } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } =
    useMovingCheckerSourceStyle(onCheckerMoving);

  const pointLabelNumber = index + 1;
  const colorStyle = pointLabelNumber % 2 === 0 ? styles.evenPointColor : styles.oddPointColor;
  const pointContainerStyle =
    side === 'top' ? styles.topPointContainer : styles.bottomPointContainer;
  const checkerContainerStyle =
    side === 'top' ? styles.topPointCheckerContainer : styles.bottomPointCheckerContainer;

  return (
    <View style={[styles.boardSection, colorStyle, pointContainerStyle, movingCheckerSourceStyle]}>
      <PointLabel number={pointLabelNumber} side={side} />
      <CheckerContainer
        index={index}
        onCheckerMoving={handleCheckerMoving}
        style={[checkerContainerStyle, movingCheckerSourceStyle]}
      />
    </View>
  );
}
