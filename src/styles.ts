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
    justifyContent: 'center',
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

  controlsArea: {
    justifyContent: 'flex-end',
  },

  controlContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
  } as ViewStyle,

  diceRollArea: {
    flexShrink: 1,
    borderTopColor: 'brown',
    borderTopWidth: 5,
    padding: 5,
  } as ViewStyle,

  statusText: {
    fontSize: 30,
    textAlign: 'center',
  } as TextStyle,

  playerText: {
    fontWeight: 'bold',
  } as TextStyle,

  diceContainer: {
    flexDirection: 'column',
  } as ViewStyle,

  die: {
    borderRadius: 5,
    color: 'white',
    margin: 5,
    width: 30,
    height: 30,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,

  redDie: {
    backgroundColor: colors.redPlayer,
    shadowColor: colors.redPlayer,
  } as ViewStyle,

  blackDie: {
    backgroundColor: colors.blackPlayer,
    shadowColor: colors.blackPlayer,
  } as ViewStyle,

  activeDie: {
    shadowRadius: 10,
  } as ViewStyle,

  halfSpentDie: {
    opacity: 0.5,
  } as ViewStyle,

  spentDie: {
    opacity: 0.2,
  } as ViewStyle,

  iconButton: {
    borderRadius: 20,
    padding: 10,
  } as ViewStyle,

  iconButtonContent: {
    alignSelf: 'center',
  } as ViewStyle,

  redButton: {
    backgroundColor: colors.redPlayer,
  } as ViewStyle,

  blackButton: {
    backgroundColor: colors.blackPlayer,
  } as ViewStyle,

  disabledButton: {
    opacity: 0.2,
  } as ViewStyle,
});
