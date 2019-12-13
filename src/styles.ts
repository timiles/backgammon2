import { StyleSheet, ViewStyle } from 'react-native';

export default StyleSheet.create({
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
    flexGrow: 1,
    paddingHorizontal: 5,
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
    paddingBottom: 10,
  } as ViewStyle,

  bottomPoint: {
    justifyContent: 'flex-end',
    paddingTop: 10,
  } as ViewStyle,

  bar: {
    backgroundColor: 'brown',
  } as ViewStyle,

  home: {
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
});
