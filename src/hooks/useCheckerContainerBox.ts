import { RefObject, useRef, useState } from 'react';
import { View } from 'react-native';

import { BoxDimensions } from '../types';

/**
 * This hook measures the container referenced by the returned ref.
 * The measurements are updated whenever changes to the DOM, orientation or window size
 * cause the referenced element to move or be resized.
 */
export function useCheckerContainerBox(): {
  ref: RefObject<View>;
  handleLayout: () => void;
  dimensions: BoxDimensions | undefined;
} {
  const [dimensions, setDimensions] = useState<BoxDimensions>();

  const ref = useRef<View>() as RefObject<View>;

  const handleLayout = () => {
    ref.current?.measure((x, y, width, height) => {
      setDimensions({ width, height });
    });
  };

  return { ref, handleLayout, dimensions };
}
