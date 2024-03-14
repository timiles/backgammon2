import Svg, { Circle } from 'react-native-svg';

import { IconProps } from './types';

export function CheckerIcon(props: IconProps) {
  const { width, fill } = props;

  return (
    <Svg viewBox="0 0 100 100" width={width}>
      <Circle cx="50" cy="50" r="48" fill={fill} />
    </Svg>
  );
}
