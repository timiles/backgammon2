import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { colors } from './colors';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'lightblue',
  } as ViewStyle,

  portraitWarning: {
    textAlign: 'center',
  },

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

  boardSection: {
    flex: 1,
  } as ViewStyle,

  topContainer: {
    flexDirection: 'column',
  } as ViewStyle,

  bottomContainer: {
    flexDirection: 'column-reverse',
  } as ViewStyle,

  oddPointColor: {
    backgroundColor: '#F99',
  } as ViewStyle,

  evenPointColor: {
    backgroundColor: '#999',
  } as ViewStyle,

  barColor: {
    backgroundColor: 'brown',
  } as ViewStyle,

  barCheckerContainer: {
    justifyContent: 'center',
  } as ViewStyle,

  pointLabelContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    backgroundColor: 'brown',
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

  offBoard: {
    backgroundColor: 'white',
    borderColor: 'brown',
    borderLeftWidth: 5,
    paddingHorizontal: 0,
  } as ViewStyle,

  topOffBoardChecker: {
    marginTop: 1,
  } as ViewStyle,

  bottomOffBoardChecker: {
    marginBottom: 1,
  } as ViewStyle,

  pipCountLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    userSelect: 'none',
  } as TextStyle,

  checkerContainer: {
    flex: 1,
    alignItems: 'center',
    zIndex: 0,
  } as ViewStyle,

  checker: {
    flexShrink: 1,
  } as ViewStyle,

  redChecker: {
    backgroundColor: colors.redPlayer,
  } as ViewStyle,

  blackChecker: {
    backgroundColor: colors.blackPlayer,
  } as ViewStyle,

  movingCheckerSource: {
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
