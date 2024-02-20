import { StyleProp, View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';

import Checker from './Checker';
import useCheckerContainerBox from '../hooks/useCheckerContainerBox';
import Player from '../models/Player';
import { RootState } from '../store';
import styles from '../styles';

interface IProps {
  onCheckerMoving: (isMoving: boolean) => void;
  style: StyleProp<ViewStyle>;
}

interface IPointProps extends IProps {
  index: number;
}

interface IBarProps extends IProps {
  index: 'bar';
  owner: Player;
}

export default function CheckerContainer(props: IPointProps | IBarProps) {
  const { index, onCheckerMoving, style } = props;

  const { board } = useSelector((state: RootState) => state.board.present);
  const { checkers } = index === 'bar' ? board.bar[props.owner] : board.points[index];

  const { ref, dimensions } = useCheckerContainerBox({ index });

  const checkerSize = dimensions
    ? Math.min(dimensions.width - 10, (dimensions.height - 10) / checkers.length)
    : undefined;

  return (
    <View ref={ref} style={[styles.checkerContainer, style]}>
      {checkerSize !== undefined &&
        checkers.map(({ id, player }) => (
          <Checker
            key={id}
            id={id}
            player={player}
            index={index}
            onMoving={onCheckerMoving}
            size={checkerSize}
          />
        ))}
    </View>
  );
}
