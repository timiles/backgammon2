import { RefObject, useEffect, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Checker from './Checker';
import { BoxModel } from '../models/BoxModel';
import Player from '../models/Player';
import { RootState } from '../store';
import { registerPointBox } from '../store/actions';
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

  const dispatch = useDispatch();

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
        if (index !== 'bar') {
          dispatch(registerPointBox({ index, box }));
        }
        setDimensions({ width, height });
      });
    }
  }, [ref.current]);

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
