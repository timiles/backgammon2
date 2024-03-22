import { View } from 'react-native';

import { GameContainer } from './GameContainer';
import { PortraitWarning } from './PortraitWarning';
import { useScreenSize } from '../hooks';

const GOLDEN_RATIO = 1.618;

export function App() {
  const { width, height, isPortrait, isSmall } = useScreenSize();

  return (
    <>
      {isPortrait && isSmall && <PortraitWarning />}
      <View style={{ flex: 1, maxHeight: Math.min(height, width / GOLDEN_RATIO) }}>
        <GameContainer />
      </View>
    </>
  );
}
