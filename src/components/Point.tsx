import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import styles from '../styles';
import Counter from './Counter';

interface IProps {
  number: number;
  onSourceChange: (active: boolean) => void;
}

type Props = IProps & StateProps;

interface IState {
  sourceCount: number;
}

class Point extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = { sourceCount: 0 };
  }

  handleSourceChange = (isSource: boolean) => {
    // Increment or decrement sourceCount, to handle asynchronous UI updates correctly
    this.setState(prevState => ({ sourceCount: prevState.sourceCount + (isSource ? 1 : -1) }));

    const { onSourceChange } = this.props;
    onSourceChange(isSource);
  };

  render() {
    const { number, player1Count, player2Count } = this.props;
    const { sourceCount } = this.state;

    const evenOddStyle = (number % 2 === 0) ? styles.evenPoint : styles.oddPoint;
    const topBottomStyle = (number <= 12) ? null : styles.bottomPoint;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;
    const pointStyle = [styles.point, evenOddStyle, topBottomStyle, sourceStyle];

    const counters: JSX.Element[] = [];
    for (let i = 0; i < player1Count; i += 1) {
      counters.push(<Counter key={i} player={1} onSourceChange={this.handleSourceChange} />);
    }
    for (let i = 0; i < player2Count; i += 1) {
      counters.push(<Counter key={i} player={2} onSourceChange={this.handleSourceChange} />);
    }

    return <View style={pointStyle}>{counters}</View>;
  }
}

const mapStateToProps = ({ board }: ApplicationState, ownProps: IProps) => (
  board.points[ownProps.number - 1]
);
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Point);