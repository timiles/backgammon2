import { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import styles from '../styles';

/**
 * This hook provides a style to fix the z-index of the source of any moving checkers
 */
export default function useMovingCheckerSourceStyle(
  onCheckerMoving?: (isMoving: boolean) => void,
): {
  handleCheckerMoving: (isMoving: boolean) => void;
  movingCheckerSourceStyle: StyleProp<ViewStyle>;
} {
  // Track number of moving checkers, as one could be picked up before another returns
  const [movingCheckersCount, setMovingCheckersCount] = useState(0);

  const handleCheckerMoving = (isMoving: boolean) => {
    setMovingCheckersCount((prev) => prev + (isMoving ? 1 : -1));

    if (onCheckerMoving) {
      onCheckerMoving(isMoving);
    }
  };

  const movingCheckerSourceStyle = movingCheckersCount > 0 ? styles.movingCheckerSource : null;

  return { handleCheckerMoving, movingCheckerSourceStyle };
}
