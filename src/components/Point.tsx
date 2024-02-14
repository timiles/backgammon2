import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Counter from './Counter';
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
  onSourceChange: (active: boolean) => void;
}

export default function Point(props: IProps) {
  const { type, index, side, onSourceChange } = props;

  const counters = useSelector((state: RootState) => state.board.present.points[index].counters);

  const dispatch = useDispatch();

  const [sourceCount, setSourceCount] = useState(0);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const ref = useRef<View>();

  useEffect(() => {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      const box: BoxModel = {
        top: pageY,
        right: pageX + width,
        bottom: pageY + height,
        left: pageX,
      };
      dispatch(registerPointBox({ index, box }));
      setWidth(width);
      setHeight(height);
    });
  }, []);

  const handleSourceChange = (isSource: boolean) => {
    // Increment or decrement sourceCount, to handle asynchronous UI updates correctly
    setSourceCount((prevSourceCount) => prevSourceCount + (isSource ? 1 : -1));

    onSourceChange(isSource);
  };

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
  const sourceStyle = sourceCount > 0 ? styles.draggableSource : null;
  const counterSize = Math.min(width - 10, (height - 10) / counters.length);

  return (
    <View ref={ref} style={[styles.counterContainer, pointStyle, sourceStyle]}>
      {!Number.isNaN(counterSize) &&
        counters.map((x) => (
          <Counter
            key={x.id}
            id={x.id}
            player={x.player}
            pointIndex={index}
            onSourceChange={handleSourceChange}
            size={counterSize}
          />
        ))}
    </View>
  );
}
