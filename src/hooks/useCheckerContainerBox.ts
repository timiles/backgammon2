import { RefObject, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BAR_POINT_INDEX } from '../constants';
import { BoxModel } from '../models/BoxModel';
import { registerCheckerContainerBox } from '../store/actions';
import { BoxDimensions } from '../types';

/**
 * This hook measures the container referenced by the returned ref, and registers it in the store.
 * The measurements are updated whenever changes to the DOM, orientation or window size
 * cause the referenced element to move or be resized.
 */
export default function useCheckerContainerBox(index: number): {
  ref: RefObject<View>;
  handleLayout: () => void;
  dimensions: BoxDimensions | undefined;
} {
  const dispatch = useDispatch();

  const [dimensions, setDimensions] = useState<BoxDimensions>();

  const ref = useRef<View>() as RefObject<View>;

  const handleLayout = () => {
    // The (event: LayoutChangeEvent) argument has x/y relative to parent element -
    // measure the referenced element instead as it gives us absolute pageX/pageY
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      const box: BoxModel = {
        top: pageY,
        right: pageX + width,
        bottom: pageY + height,
        left: pageX,
      };

      // No need to store bar container as we cannot move a checker to the bar directly
      if (index !== BAR_POINT_INDEX) {
        dispatch(registerCheckerContainerBox({ index, box }));
      }

      setDimensions({ width, height });
    });
  };

  return { ref, handleLayout, dimensions };
}
