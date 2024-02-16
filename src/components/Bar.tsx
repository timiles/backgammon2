import { View } from 'react-native';

import CheckerContainer from './CheckerContainer';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import Player from '../models/Player';
import { BarIndexes } from '../store/Board';
import styles from '../styles';

interface IProps {
  owner: Player;
  onCheckerMoving: (isMoving: boolean) => void;
}

export default function Bar(props: IProps) {
  const { owner, onCheckerMoving } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } =
    useMovingCheckerSourceStyle(onCheckerMoving);

  const index = BarIndexes[owner];

  return (
    <View style={[styles.boardSection, styles.barColor, movingCheckerSourceStyle]}>
      <CheckerContainer
        index={index}
        onCheckerMoving={handleCheckerMoving}
        style={[styles.barCheckerContainer, movingCheckerSourceStyle]}
      />
    </View>
  );
}
