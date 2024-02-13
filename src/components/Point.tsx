import { Component, RefObject, createRef } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Counter from './Counter';
import { BoxModel } from '../models/BoxModel';
import { ApplicationState } from '../store';
import * as BoardStore from '../store/Board';
import styles from '../styles';
import { Side } from '../types';

type PointType = 'Point' | 'Bar' | 'Home';

interface IProps {
  type: PointType;
  index: number;
  side: Side;
  onSourceChange: (active: boolean) => void;
}

type Props = IProps & StateProps & DispatchProps;

interface IState {
  sourceCount: number;
  width?: number;
  height?: number;
}

class Point extends Component<Props, IState> {
  readonly ref: RefObject<View>;

  constructor(props: Props) {
    super(props);

    this.state = { sourceCount: 0 };

    this.ref = createRef<View>();
  }

  componentDidMount() {
    const { registerPointBox, index } = this.props;

    this.ref.current.measure((x, y, width, height, pageX, pageY) => {
      const box: BoxModel = {
        top: pageY,
        right: pageX + width,
        bottom: pageY + height,
        left: pageX,
      };
      registerPointBox(index, box);
      this.setState({ width, height });
    });
  }

  handleSourceChange = (isSource: boolean) => {
    // Increment or decrement sourceCount, to handle asynchronous UI updates correctly
    this.setState((prevState) => ({ sourceCount: prevState.sourceCount + (isSource ? 1 : -1) }));

    const { onSourceChange } = this.props;
    onSourceChange(isSource);
  };

  render() {
    const { type, index, side, counters } = this.props;
    const { sourceCount, width, height } = this.state;

    const getStyle = () => {
      switch (type) {
        case 'Bar':
          return styles.bar;
        case 'Point': {
          const evenOddStyle = (index + 1) % 2 === 0 ? styles.evenPoint : styles.oddPoint;
          const topBottomStyle = side === 'top' ? styles.topPoint : styles.bottomPoint;
          return [evenOddStyle, topBottomStyle];
        }
        default:
          return null;
      }
    };

    const pointStyle = getStyle();
    const sourceStyle = sourceCount > 0 ? styles.draggableSource : null;
    const counterSize = Math.min(width - 10, (height - 10) / counters.length);

    return (
      <View ref={this.ref} style={[styles.counterContainer, pointStyle, sourceStyle]}>
        {!Number.isNaN(counterSize) &&
          counters.map((x) => (
            <Counter
              key={x.id}
              id={x.id}
              player={x.player}
              pointIndex={index}
              onSourceChange={this.handleSourceChange}
              size={counterSize}
            />
          ))}
      </View>
    );
  }
}

const mapStateToProps = ({ board }: ApplicationState, ownProps: IProps) => ({
  counters: board.present.points[ownProps.index].counters,
});
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = BoardStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Point);
