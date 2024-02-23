import { RefObject, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BarPointIndex } from '../constants';
import { BoxModel } from '../models/BoxModel';
import { registerCheckerContainerBox } from '../store/actions';
import { BoxDimensions } from '../types';

/**
 * This hook measures the container referenced by the returned ref, and registers it in the store
 */
export default function useCheckerContainerBox(index: number): {
  ref: RefObject<View>;
  dimensions: BoxDimensions | undefined;
} {
  const dispatch = useDispatch();

  const [dimensions, setDimensions] = useState<BoxDimensions>();

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

        if (index !== BarPointIndex) {
          dispatch(registerCheckerContainerBox({ index, box }));
        }

        setDimensions({ width, height });
      });
    }
  }, [ref.current]);

  return { ref, dimensions };
}
