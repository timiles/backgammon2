import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { colors } from './colors';

const styles = StyleSheet.create({
  app: {
    flex: 1,
  } as ViewStyle,

  portraitWarning: {
    textAlign: 'center',
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

  gameContainer: {
    flex: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'lightblue',
  } as ViewStyle,

  game: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  board: {
    flexGrow: 1,
    flexDirection: 'column',
    borderColor: 'brown',
    borderLeftWidth: 5,
  } as ViewStyle,

  boardColor: {
    backgroundColor: 'brown',
  } as ViewStyle,

  boardEdge: {
    flexDirection: 'row',
  } as ViewStyle,

  boardHalf: {
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'row',
  } as ViewStyle,

  boardSection: {
    flex: 1,
  } as ViewStyle,

  oddPointColor: {
    backgroundColor: '#F99',
  } as ViewStyle,

  evenPointColor: {
    backgroundColor: '#999',
  } as ViewStyle,

  pointLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  } as ViewStyle,

  topPointLabelContainer: {
    flexDirection: 'row-reverse',
  } as ViewStyle,

  bottomPointLabelContainer: {
    flexDirection: 'row',
  } as ViewStyle,

  pointLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    userSelect: 'none',
  } as TextStyle,

  offBoardContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'brown',
    borderLeftWidth: 5,
    borderRightWidth: 5,
  } as ViewStyle,

  pipCountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    userSelect: 'none',
  } as TextStyle,

  checkersArea: {
    flex: 1,
    zIndex: 1,
  } as ViewStyle,

  checker: {
    position: 'absolute',
    zIndex: 1,
  } as ViewStyle,

  moveableChecker: {
    zIndex: 2,
  } as ViewStyle,

  movingChecker: {
    zIndex: 3,
  } as ViewStyle,

  redChecker: {
    backgroundColor: colors.redPlayer,
  } as ViewStyle,

  blackChecker: {
    backgroundColor: colors.blackPlayer,
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
    userSelect: 'none',
  } as TextStyle,

  smallStatusText: {
    fontSize: 15,
  } as TextStyle,

  playerText: {
    fontWeight: 'bold',
  } as TextStyle,

  diceContainer: {
    flexDirection: 'column',
  } as ViewStyle,

  die: {
    borderRadius: 5,
    margin: 5,
    width: 30,
    height: 30,
  } as ViewStyle,

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

  disabledDie: {
    opacity: 0.2,
  } as ViewStyle,

  dieText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    userSelect: 'none',
  } as TextStyle,

  doubleDieText: {
    fontSize: 10,
  } as TextStyle,

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

export { styles };
