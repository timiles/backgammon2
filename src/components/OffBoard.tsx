import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import OffBoardCheckers from './OffBoardCheckers';
import { OFF_POINT_INDEX } from '../constants';
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
    (state: RootState) => state.board.present.board.points[owner][OFF_POINT_INDEX],
  );

  const pipCount = useSelector((state: RootState) => state.board.present.board.pipCounts[owner]);

  const { ref, dimensions } = useCheckerContainerBox(OFF_POINT_INDEX);

  const containerStyle = side === 'top' ? styles.topContainer : styles.bottomContainer;
  const labelStyle = [
    side === 'top' ? styles.upsideDown : null,
    owner === Player.Red ? styles.redPlayer : styles.blackPlayer,
  ];

  return (
    <View style={[styles.boardSection, styles.offBoard, containerStyle]}>
      <Text style={[styles.pipCountLabel, labelStyle]}>{pipCount}</Text>
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
