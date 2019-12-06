import * as React from 'react';
import colors from '../colors';

interface IProps {
  player: 1 | 2;
}

export default function Counter(props: IProps) {
  const { player } = props;
  const color = player === 1 ? colors.Player1 : colors.Player2;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill={color} />
    </svg>
  );
}
