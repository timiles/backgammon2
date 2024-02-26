import { View } from 'react-native';

import { CheckerModel } from '../models/CheckerModel';
import Player from '../models/Player';
import styles from '../styles';
import { BoxDimensions, Side } from '../types';

interface IProps {
  owner: Player;
  side: Side;
  containerDimensions: BoxDimensions;
  checkers: CheckerModel[];
}

export default function OffBoardCheckers(props: IProps) {
  const { owner, side, checkers, containerDimensions } = props;

  const color = owner === Player.Red ? styles.redChecker : styles.blackChecker;
  const topBottomStyle = side === 'top' ? styles.topOffBoardChecker : styles.bottomOffBoardChecker;

  const width = containerDimensions.width - 10;
  const height = containerDimensions.height / 15 - 1;

  return checkers.map(({ id }) => (
    <View key={id} style={[color, topBottomStyle, { width, height }]} />
  ));
}
