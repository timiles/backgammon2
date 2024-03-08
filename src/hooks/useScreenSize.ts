import { useWindowDimensions } from 'react-native';

const MIN_WIDTH = 500;

export default function useScreenSize() {
  const { width, height } = useWindowDimensions();

  const isPortrait = width < height;

  const isSmall = width < MIN_WIDTH;

  return { width, height, isPortrait, isSmall };
}
