import * as React from 'react';
import { Animated, GestureResponderHandlers, PanResponder } from 'react-native';
import colors from '../colors';

interface IProps {
  player: 1 | 2;
  onSourceChange: (isSource: boolean) => void;
}

interface IState {
  counterLocation: Animated.ValueXY;
}

export default class Counter extends React.Component<IProps, IState> {
  readonly gestureResponderHandlers: GestureResponderHandlers;

  constructor(props: IProps) {
    super(props);

    const counterLocation = new Animated.ValueXY({ x: 0, y: 0 });
    this.state = { counterLocation };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => {
        props.onSourceChange(true);
      },
      onPanResponderMove: Animated.event([null, { dx: counterLocation.x, dy: counterLocation.y }]),
      onPanResponderRelease: () => {
        Animated.spring(counterLocation, { toValue: { x: 0, y: 0 }, friction: 5 })
          .start(() => {
            props.onSourceChange(false);
          });
      },
    });
    this.gestureResponderHandlers = panResponder.panHandlers;
  }

  render() {
    const { player } = this.props;
    const color = player === 1 ? colors.Player1 : colors.Player2;

    const { counterLocation } = this.state;
    const counterLocationStyle = { transform: counterLocation.getTranslateTransform() };

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Animated.View style={counterLocationStyle} {...this.gestureResponderHandlers}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill={color} />
        </svg>
      </Animated.View>
    );
  }
}
