import { RefObject, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Checker from './Checker';
import useMovingCheckerSourceStyle from '../hooks/useMovingCheckerSourceStyle';
import { BoxModel } from '../models/BoxModel';
import { RootState } from '../store';
import { registerPointBox } from '../store/actions';
import styles from '../styles';
import { Side } from '../types';

type PointType = 'Point' | 'Bar' | 'Home';

interface IProps {
  type: PointType;
  index: number;
  side: Side;
  onCheckerMoving: (isMoving: boolean) => void;
}

export default function Point(props: IProps) {
  const { type, index, side, onCheckerMoving } = props;

  const checkers = useSelector((state: RootState) => state.board.present.points[index].checkers);

  const dispatch = useDispatch();

  const { handleCheckerMoving, movingCheckerSourceStyle } =
    useMovingCheckerSourceStyle(onCheckerMoving);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>();

  const ref = useRef<View>() as RefObject<View>;

  useEffect(() => {
    if (ref.current && !dimensions) {
      ref.current.measure((x, y, width, height, pageX, pageY) => {
        const box: BoxModel = {
          top: pageY,
          right: pageX + width,
          bottom: pageY + height,
          left: pageX,
        };
        dispatch(registerPointBox({ index, box }));
        setDimensions({ width, height });
      });
    }
  }, [ref.current]);

  const getStyle = () => {
    switch (type) {
      case 'Bar':
        return styles.bar;
      case 'Point': {
        const evenOddStyle = (index + 1) % 2 === 0 ? styles.evenPoint : styles.oddPoint;
        const topBottomStyle = side === 'top' ? styles.topPoint : styles.bottomPoint;
        return [evenOddStyle, topBottomStyle];
      }
      default:
        return null;
    }
  };

  const pointStyle = getStyle();
  const checkerSize = dimensions
    ? Math.min(dimensions.width - 10, (dimensions.height - 10) / checkers.length)
    : undefined;

  return (
    <View ref={ref} style={[styles.checkerContainer, pointStyle, movingCheckerSourceStyle]}>
      {checkerSize !== undefined &&
        checkers.map((x) => (
          <Checker
            key={x.id}
            id={x.id}
            player={x.player}
            pointIndex={index}
            onMoving={handleCheckerMoving}
            size={checkerSize}
          />
        ))}
    </View>
  );
}
