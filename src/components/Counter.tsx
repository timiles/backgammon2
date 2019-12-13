import * as React from 'react';
// eslint-disable-next-line
import { Animated, GestureResponderEvent, GestureResponderHandlers, PanResponder, PanResponderGestureState } from 'react-native';
import { connect } from 'react-redux';
import colors from '../colors';
import { CounterModel } from '../models/CounterModel';
import { ApplicationState } from '../store';
import * as BoardStore from '../store/Board';

interface IOwnProps extends CounterModel {
  pointIndex: number;
  onSourceChange: (isSource: boolean) => void;
}

interface IState {
  counterLocation: Animated.ValueXY;
}

type Props = IOwnProps & StateProps & DispatchProps;

class Counter extends React.Component<Props, IState> {
  readonly gestureResponderHandlers: GestureResponderHandlers;

  constructor(props: Props) {
    super(props);

    const counterLocation = new Animated.ValueXY({ x: 0, y: 0 });
    this.state = { counterLocation };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => {
        props.onSourceChange(true);
      },
      onPanResponderMove: Animated.event([null, { dx: counterLocation.x, dy: counterLocation.y }]),
      onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { moveX, moveY } = gestureState;
        const {
          id, pointIndex, pointBoxes, moveCounter,
        } = this.props;
        const targetIndex = pointBoxes.findIndex(
          x => x.left < moveX && moveX < x.right && x.top < moveY && moveY < x.bottom,
        );
        if (targetIndex >= 0 && targetIndex !== pointIndex) {
          moveCounter(id, pointIndex, targetIndex);
          props.onSourceChange(false);
        } else {
          Animated.spring(counterLocation, { toValue: { x: 0, y: 0 }, friction: 5 })
            .start(() => {
              props.onSourceChange(false);
            });
        }
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

const mapStateToProps = ({ board }: ApplicationState) => (
  { pointBoxes: board.points.map(x => x.box) }
);
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = BoardStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
