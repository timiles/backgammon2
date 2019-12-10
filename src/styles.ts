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
    flexDirection: 'row',
    zIndex: 0,
  } as ViewStyle,

  point: {
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

  bottomPoint: {
    justifyContent: 'flex-end',
  } as ViewStyle,

  bar: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'brown',
  } as ViewStyle,

  home: {
    flex: 1,
    flexGrow: 1,
    borderColor: 'brown',
    borderLeftWidth: 5,
  } as ViewStyle,

  draggableSource: {
    zIndex: 1,
  } as ViewStyle,
});
