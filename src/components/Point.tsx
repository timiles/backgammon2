import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { BoxModel } from '../models/BoxModel';
import { ApplicationState } from '../store';
import * as BoardStore from '../store/Board';
import styles from '../styles';
import Counter from './Counter';

interface IProps {
  index: number;
  onSourceChange: (active: boolean) => void;
}

type Props = IProps & StateProps & DispatchProps;

interface IState {
  sourceCount: number;
  width?: number;
  height?: number;
}

class Point extends React.Component<Props, IState> {
  readonly ref: React.RefObject<View>;

  constructor(props: Props) {
    super(props);

    this.state = { sourceCount: 0 };

    this.ref = React.createRef<View>();
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
    this.setState(prevState => ({ sourceCount: prevState.sourceCount + (isSource ? 1 : -1) }));

    const { onSourceChange } = this.props;
    onSourceChange(isSource);
  };

  render() {
    const { index, counters } = this.props;
    const { sourceCount, width, height } = this.state;

    const evenOddStyle = ((index + 1) % 2 === 0) ? styles.evenPoint : styles.oddPoint;
    const topBottomStyle = (index < 12) ? styles.topPoint : styles.bottomPoint;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;
    const pointStyle = [styles.counterContainer, evenOddStyle, topBottomStyle, sourceStyle];

    const counterSize = Math.min(width - 10, (height - 10) / counters.length);

    return (
      <View ref={this.ref} style={pointStyle}>
        {!Number.isNaN(counterSize) && counters.map(x => (
          <Counter
            key={x.id}
            id={x.id}
            playerId={x.playerId}
            pointIndex={index}
            onSourceChange={this.handleSourceChange}
            size={counterSize}
          />
        ))}
      </View>
    );
  }
}

const mapStateToProps = ({ board }: ApplicationState, ownProps: IProps) => (
  { counters: board.points[ownProps.index].counters }
);
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = BoardStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Point);
