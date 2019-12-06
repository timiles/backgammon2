import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import styles from '../styles';
import Counter from './Counter';

interface IProps {
  number: number;
}

type Props = IProps & StateProps;

function Point(props: Props) {
  const { number, player1Count, player2Count } = props;
  const evenOdd = (number % 2 === 0) ? styles.evenPoint : styles.oddPoint;
  const topBottom = (number <= 12) ? null : styles.bottomPoint;

  const counters: JSX.Element[] = [];
  for (let i = 0; i < player1Count; i += 1) {
    counters.push(<Counter key={i} player={1} />);
  }
  for (let i = 0; i < player2Count; i += 1) {
    counters.push(<Counter key={i} player={2} />);
  }

  return <View style={[styles.point, evenOdd, topBottom]}>{counters}</View>;
}

const mapStateToProps = ({ board }: ApplicationState, ownProps: IProps) => (
  board.points[ownProps.number - 1]
);
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Point);
