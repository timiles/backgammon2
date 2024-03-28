import Svg, { Rect } from 'react-native-svg';

import { IconProps } from './types';

export function OffCheckerIcon(props: IconProps) {
  const { width, height, fill } = props;

  return (
    <Svg width={width} height={height}>
      <Rect width="100%" height="100%" fill={fill} />
    </Svg>
  );
}
