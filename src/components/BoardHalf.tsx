import * as React from 'react';
import { View } from 'react-native';
import Player from '../models/Player';
import { BarIndexes } from '../store/Board';
import styles from '../styles';
import { Side } from '../types';
import Home from './Home';
import Point from './Point';

interface IProps {
  side: Side;
}

interface IState {
  sourceCount: number;
}

export default class BoardHalf extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { sourceCount: 0 };
  }

  handleSourceChange = (isSource: boolean) => {
    // Increment or decrement sourceCount, to handle asynchronous UI updates correctly
    this.setState(prevState => ({ sourceCount: prevState.sourceCount + (isSource ? 1 : -1) }));
  };

  render() {
    const { side } = this.props;
    // Top side:    12|11|10| 9| 8| 7|bar (0)| 6| 5| 4| 3| 2| 1
    // Bottom side: 13|14|15|16|17|18|bar(24)|19|20|21|22|23|24
    const startingPointIndex = (side === 'top') ? 12 : 13;
    const direction = (side === 'top') ? -1 : 1;
    const barIndex = BarIndexes[(side === 'top') ? Player.Red : Player.Black];

    const { sourceCount } = this.state;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;

    const leftHandPoints: JSX.Element[] = [];
    const rightHandPoints: JSX.Element[] = [];
    for (let i = 0; i < 6; i += 1) {
      const pointIndex = startingPointIndex + (i * direction);
      leftHandPoints.push(
        <Point
          key={i}
          type="Point"
          index={pointIndex}
          side={side}
          onSourceChange={this.handleSourceChange}
        />,
      );
      rightHandPoints.push(
        <Point
          key={i}
          type="Point"
          index={pointIndex + (6 * direction)}
          side={side}
          onSourceChange={this.handleSourceChange}
        />,
      );
    }

    return (
      <View style={[styles.boardHalf, sourceStyle]}>
        {leftHandPoints}
        <Point type="Bar" index={barIndex} side={side} onSourceChange={this.handleSourceChange} />
        {rightHandPoints}
        <Home />
      </View>
    );
  }
}
