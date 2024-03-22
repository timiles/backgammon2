import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';

import { App } from './components/App';
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
      <App />
    </Provider>
  );
}

export default registerRootComponent(Root);
