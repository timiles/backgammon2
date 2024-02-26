import { View } from 'react-native';
import { useSelector } from 'react-redux';

import OffBoardCheckers from './OffBoardCheckers';
import { OffPointIndex } from '../constants';
import useCheckerContainerBox from '../hooks/useCheckerContainerBox';
import Player from '../models/Player';
import { RootState } from '../store';
import styles from '../styles';
import { Side } from '../types';

interface IProps {
  owner: Player;
  side: Side;
}

export default function OffBoard(props: IProps) {
  const { owner, side } = props;

  const { checkers } = useSelector(
    (state: RootState) => state.board.present.board.points[owner][OffPointIndex],
  );

  const { ref, dimensions } = useCheckerContainerBox(OffPointIndex);

  const containerStyle = side === 'top' ? styles.topContainer : styles.bottomContainer;

  return (
    <View style={[styles.boardSection, styles.offBoard]}>
      <View ref={ref} style={[styles.checkerContainer, containerStyle]}>
        {dimensions && (
          <OffBoardCheckers
            owner={owner}
            side={side}
            containerDimensions={dimensions}
            checkers={checkers}
          />
        )}
      </View>
    </View>
  );
}
