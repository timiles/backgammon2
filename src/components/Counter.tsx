import * as React from 'react';
import { Animated, GestureResponderEvent, GestureResponderHandlers, PanResponder, PanResponderGestureState } from 'react-native';
import { connect } from 'react-redux';
import colors from '../colors';
import { CounterModel } from '../models/CounterModel';
import Player from '../models/Player';
import { ApplicationState } from '../store';
import * as BoardStore from '../store/Board';
import styles from '../styles';
import { getDistance, getOtherPlayer } from '../utils';

interface IOwnProps extends CounterModel {
  pointIndex: number;
  onSourceChange: (isSource: boolean) => void;
  size: number;
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
        const { id, player, pointIndex, points, moveCounter } = this.props;
        const destinationIndex = points.map(x => x.box).findIndex(
          x => x.left < moveX && moveX < x.right && x.top < moveY && moveY < x.bottom,
        );
        if (destinationIndex >= 0 && this.canMove(destinationIndex)) {
          moveCounter(id, player, pointIndex, destinationIndex);
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

  private canMove(destinationIndex?: number) {
    const { pointIndex, points, dice, player, currentPlayer } = this.props;

    if (player !== currentPlayer) {
      return false;
    }

    const barIndex = BoardStore.BarIndexes[player];
    if (points[barIndex].counters.length > 0 && barIndex !== pointIndex) {
      // Player has counters on the bar, and this is not their bar
      return false;
    }

    if (destinationIndex != null) {
      if (destinationIndex === pointIndex) {
        // Can't move to the same point
        return false;
      }

      const otherPlayer = getOtherPlayer(player);
      if (points[destinationIndex].counters.filter(x => x.player === otherPlayer).length > 1) {
        // Destination is blocked by other player
        return false;
      }

      const distance = getDistance(player, pointIndex, destinationIndex);
      if (!dice.some(x => x.value === distance && !x.isSpent)) {
        // Don't have the dice roll available
        return false;
      }
    }

    return true;
  }

  render() {
    const { player, size } = this.props;

    const color = player === Player.Red ? colors.redPlayer : colors.blackPlayer;

    const { counterLocation } = this.state;
    const counterLocationStyle = { transform: counterLocation.getTranslateTransform() };
    const counterStyle = [styles.counter, counterLocationStyle];

    const animatedViewProps = this.canMove() ? this.gestureResponderHandlers : null;

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Animated.View style={counterStyle} {...animatedViewProps}>
        <svg viewBox="0 0 100 100" width={size} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill={color} />
        </svg>
      </Animated.View>
    );
  }
}

const mapStateToProps = ({ board, dice, player }: ApplicationState, ownProps: IOwnProps) => (
  {
    points: board.present.points,
    dice: dice.present.dice[ownProps.player],
    currentPlayer: player.present.currentPlayer,
  }
);
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = BoardStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
