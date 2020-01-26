import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  app: {
    flex: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'lightblue',
  } as ViewStyle,

  redPlayer: {
    color: colors.redPlayer,
  } as ViewStyle,

  blackPlayer: {
    color: colors.blackPlayer,
  } as ViewStyle,

  upsideDown: {
    transform: [{ rotate: '180deg' }],
  } as ViewStyle,

  game: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  board: {
    flexGrow: 1,
    flexDirection: 'column',
    borderColor: 'brown',
    borderWidth: 5,
  } as ViewStyle,

  boardHalf: {
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'row',
    zIndex: 0,
  } as ViewStyle,

  counterContainer: {
    flex: 1,
    alignItems: 'center',
    zIndex: 0,
  } as ViewStyle,

  oddPoint: {
    backgroundColor: '#F99',
  } as ViewStyle,

  evenPoint: {
    backgroundColor: '#999',
  } as ViewStyle,

  topPoint: {
    justifyContent: 'flex-start',
  } as ViewStyle,

  bottomPoint: {
    justifyContent: 'flex-end',
  } as ViewStyle,

  bar: {
    backgroundColor: 'brown',
  } as ViewStyle,

  home: {
    backgroundColor: 'white',
    borderColor: 'brown',
    borderLeftWidth: 5,
    paddingHorizontal: 0,
  } as ViewStyle,

  counter: {
    flexShrink: 1,
  } as ViewStyle,

  draggableSource: {
    zIndex: 1,
  } as ViewStyle,

  diceRollArea: {
    flexShrink: 1,
    padding: 5,
  } as ViewStyle,

  statusText: {
    fontSize: 30,
    textAlign: 'center',
  } as TextStyle,

  playerText: {
    fontWeight: 'bold',
  } as TextStyle,
});
