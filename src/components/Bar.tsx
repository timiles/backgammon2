import { memo } from 'react';
import { View } from 'react-native';

import { styles } from '../styles';

export const Bar = memo(function () {
  return <View style={[styles.boardSection, styles.boardColor]} />;
});
