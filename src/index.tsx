import * as Expo from 'expo';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import * as StoreModule from './store';

function Root() {
  const rootReducer = combineReducers<StoreModule.ApplicationState>(StoreModule.reducers);
  const middlewares = applyMiddleware(thunk);
  const store = createStore(rootReducer, middlewares);
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
