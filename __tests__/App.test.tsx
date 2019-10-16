import * as React from 'react';
import 'react-native';
import * as renderer from 'react-test-renderer';
import App from '../App';

it('renders correctly', () => {
  renderer.create(<App />);
});
