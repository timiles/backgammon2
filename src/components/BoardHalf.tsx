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
    // Top side:    11|10| 9| 8| 7| 6|bar| 5| 4| 3| 2| 1| 0
    // Bottom side: 12|13|14|15|16|17|bar|18|19|20|21|22|23
    const startingPointIndex = (side === 'top') ? 11 : 12;
    const direction = (side === 'top') ? -1 : 1;

    const { sourceCount } = this.state;
    const sourceStyle = (sourceCount > 0) ? styles.draggableSource : null;

    const leftHandPoints: JSX.Element[] = [];
    const rightHandPoints: JSX.Element[] = [];
    for (let i = 0; i < 6; i += 1) {
      const pointIndex = startingPointIndex + (i * direction);
      leftHandPoints.push(
        <Point
          key={i}
          index={pointIndex}
          onSourceChange={this.handleSourceChange}
        />,
      );
      rightHandPoints.push(
        <Point
          key={i}
          index={pointIndex + (6 * direction)}
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
