import * as React from 'react';
import { View } from 'react-native';
import styles from '../styles';
import Bar from './Bar';
import Home from './Home';
import Point from './Point';

interface IProps {
  side: 'top' | 'bottom';
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
    // Top side starts at point 12 on the left and goes down to point 1 on the right
    // Bottom side starts at point 13 on the left and goes up to point 24 on the right
    const startingPointNumber = (side === 'top') ? 12 : 13;
    const direction = (side === 'top') ? -1 : 1;

    const { sourceCount } = this.state;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;

    const leftHandPoints: JSX.Element[] = [];
    const rightHandPoints: JSX.Element[] = [];
    for (let i = 0; i < 6; i += 1) {
      const number = startingPointNumber + (i * direction);
      leftHandPoints.push(
        <Point
          key={i}
          number={number}
          onSourceChange={this.handleSourceChange}
        />,
      );
      rightHandPoints.push(
        <Point
          key={i}
          number={number + (6 * direction)}
          onSourceChange={this.handleSourceChange}
        />,
      );
    }

    return (
      <View style={[styles.boardHalf, sourceStyle]}>
        {leftHandPoints}
        <Bar />
        {rightHandPoints}
        <Home />
      </View>
    );
  }
}
