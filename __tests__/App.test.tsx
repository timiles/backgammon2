import * as React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import * as renderer from 'react-test-renderer';
import { combineReducers, createStore } from 'redux';
import App from '../src/App';
import * as StoreModule from '../src/store';

it('renders correctly', () => {
  const rootReducer = combineReducers<StoreModule.ApplicationState>(StoreModule.reducers);
  const store = createStore(rootReducer);
  const app = (
    <Provider store={store}>
      <App />
    </Provider>
  );
  renderer.create(app);
});
