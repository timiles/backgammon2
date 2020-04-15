import * as Expo from 'expo';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import * as StoreModule from './store';

export interface KeyPressAction {
  type: 'KeyPressAction',
  payload: { event: KeyboardEvent },
}

function Root() {
  const rootReducer = combineReducers<StoreModule.ApplicationState>(StoreModule.reducers);
  const middlewares = applyMiddleware(thunk);
  const store = createStore(rootReducer, middlewares);

  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    document.addEventListener('keydown', event => {
      const action: KeyPressAction = { type: 'KeyPressAction', payload: { event } };
      store.dispatch(action);
    });
  }

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./store', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require<typeof StoreModule>('./store');
      store.replaceReducer(combineReducers<StoreModule.ApplicationState>(nextRootReducer.reducers));
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

export default Expo.registerRootComponent(Root);
