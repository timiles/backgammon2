import { memo } from 'react';
import { View } from 'react-native';

import { styles } from '../styles';

export const OffBoard = memo(function () {
  return (
    <View style={styles.boardSection}>
      <View style={styles.offBoardContainer} />
    </View>
  );
});
