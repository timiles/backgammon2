import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { OffBoardCheckers } from './OffBoardCheckers';
import { OFF_POINT_INDEX, Player } from '../constants';
import { useCheckerContainerBox } from '../hooks';
import { RootState } from '../store';
import { styles } from '../styles';
import { Side } from '../types';

interface IProps {
  owner: Player;
  side: Side;
}

export function OffBoard(props: IProps) {
  const { owner, side } = props;

  const { checkers } = useSelector(
    (state: RootState) => state.board.present.board.points[owner][OFF_POINT_INDEX],
  );

  const { ref, handleLayout, dimensions } = useCheckerContainerBox(OFF_POINT_INDEX);

  const topBottomStyle = side === 'top' ? styles.topContainer : styles.bottomContainer;

  return (
    <View style={[styles.boardSection, topBottomStyle]}>
      <View
        ref={ref}
        onLayout={handleLayout}
        style={[styles.checkerContainer, styles.offBoardContainer, topBottomStyle]}
      >
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
