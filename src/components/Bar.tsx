import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Checker from './Checker';
import { BAR_POINT_INDEX, Player } from '../constants';
import useCheckerContainerBox from '../hooks/useCheckerContainerBox';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import { RootState } from '../store';
import styles from '../styles';
import { getCheckerSize } from '../utils';

interface IProps {
  owner: Player;
  onCheckerMoving: (isMoving: boolean) => void;
}

export default function Bar(props: IProps) {
  const { owner, onCheckerMoving } = props;

  const { handleCheckerMoving, movingCheckerSourceStyle } =
    useMovingCheckerSourceStyle(onCheckerMoving);

  const { ref, dimensions } = useCheckerContainerBox(BAR_POINT_INDEX);

  const { checkers } = useSelector(
    (state: RootState) => state.board.present.board.points[owner][BAR_POINT_INDEX],
  );

  const checkerSize = dimensions ? getCheckerSize(dimensions, checkers.length) : undefined;

  return (
    <View style={[styles.boardSection, styles.barColor, movingCheckerSourceStyle]}>
      <View
        ref={ref}
        style={[styles.checkerContainer, styles.barCheckerContainer, movingCheckerSourceStyle]}
      >
        {checkerSize !== undefined &&
          checkers.map(({ id }) => (
            <Checker
              key={id}
              checkerId={id}
              player={owner}
              index={BAR_POINT_INDEX}
              onMoving={handleCheckerMoving}
              size={checkerSize}
            />
          ))}
      </View>
    </View>
  );
}
