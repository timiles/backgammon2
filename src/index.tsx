import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Platform, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';
import { keyPress } from './store/actions';

function Root() {
  if (Platform.OS === 'web') {
    document.addEventListener('keydown', (event) => {
      store.dispatch(keyPress({ eventKey: event.key }));
    });
  }

  return (
    <Provider store={store}>
      <View style={styles.mobileSize}>
        <App />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  mobileSize: {
    flex: 1,
    maxHeight: 411,
    maxWidth: 731,
  },
});

export default registerRootComponent(Root);
