import { View } from 'react-native';

import { GameContainer } from './GameContainer';
import { PortraitWarning } from './PortraitWarning';
import { useScreenSize } from '../hooks';
import { styles } from '../styles';

const GOLDEN_RATIO = 1.618;

export function App() {
  const { width, height, isPortrait, isSmall } = useScreenSize();

  return (
    <View style={styles.app}>
      {isPortrait && isSmall && <PortraitWarning />}
      <View style={{ flex: 1, maxHeight: Math.min(height, width / GOLDEN_RATIO) }}>
        <GameContainer />
      </View>
    </View>
  );
}
