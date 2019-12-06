import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import Board from './components/Board';
import * as StoreModule from './store';

export default function App() {
  const rootReducer = combineReducers<StoreModule.ApplicationState>(StoreModule.reducers);
  const store = createStore(rootReducer);
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Board />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 411,
    maxWidth: 731,
  },
});
