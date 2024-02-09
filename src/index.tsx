import registerRootComponent from 'expo/build/launch/registerRootComponent';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { thunk } from 'redux-thunk';
import App from './App';
import * as StoreModule from './store';

export interface KeyPressAction {
  type: 'KeyPressAction',
  payload: { event: KeyboardEvent },
}

function Root() {
  const rootReducer = combineReducers<StoreModule.ApplicationState>(StoreModule.reducers);
  const middlewares = applyMiddleware(thunk);
  const store = createStore(rootReducer, composeWithDevTools(middlewares));

  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-undef
    document.addEventListener('keydown', event => {
      const action: KeyPressAction = { type: 'KeyPressAction', payload: { event } };
      store.dispatch(action);
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
