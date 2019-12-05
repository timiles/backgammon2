import * as React from 'react';
import { View } from 'react-native';
import styles from '../styles';

interface IProps {
  number: number;
}

export default function Point(props: IProps) {
  const { number } = props;
  const evenOdd = (number % 2 === 0) ? styles.evenPoint : styles.oddPoint;
  return <View style={[styles.point, evenOdd]} />;
}
