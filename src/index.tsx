import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Platform, View } from 'react-native';
import { Provider } from 'react-redux';

import App from './App';
import PortraitWarning from './components/PortraitWarning';
import useScreenSize from './hooks/useScreenSize';
import { store } from './store';
import { keyPress } from './store/actions';

const GOLDEN_RATIO = 1.618;

function Root() {
  if (Platform.OS === 'web') {
    document.addEventListener('keydown', (event) => {
      store.dispatch(keyPress({ eventKey: event.key }));
    });
  }

  const { width, height, isPortrait, isSmall } = useScreenSize();

  return (
    <Provider store={store}>
      {isPortrait && isSmall && <PortraitWarning />}
      <View style={{ flex: 1, maxHeight: Math.min(height, width / GOLDEN_RATIO) }}>
        <App />
      </View>
    </Provider>
  );
}

export default registerRootComponent(Root);
