import { memo } from 'react';
import { Text } from 'react-native';

import { styles } from '../styles';

export const PortraitWarning = memo(function () {
  return <Text style={styles.portraitWarning}>TIP: Rotate your device to landscape mode!</Text>;
});
