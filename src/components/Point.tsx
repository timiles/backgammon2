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
    const { sourceCount } = this.state;

    const evenOddStyle = ((index + 1) % 2 === 0) ? styles.evenPoint : styles.oddPoint;
    const topBottomStyle = (index < 12) ? null : styles.bottomPoint;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;
    const pointStyle = [styles.counterContainer, evenOddStyle, topBottomStyle, sourceStyle];

    return (
      <View ref={this.ref} style={pointStyle}>
        {counters.map(x => (
          <Counter
            key={x.id}
            id={x.id}
            player={x.player}
            pointIndex={index}
            onSourceChange={this.handleSourceChange}
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
