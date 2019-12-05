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
  } as ViewStyle,

  point: {
    flexGrow: 1,
  } as ViewStyle,

  oddPoint: {
    backgroundColor: '#F99',
  } as ViewStyle,

  evenPoint: {
    backgroundColor: '#999',
  } as ViewStyle,

  bar: {
    flexGrow: 1,
    backgroundColor: 'brown',
  } as ViewStyle,

  home: {
    flexGrow: 1,
    borderColor: 'brown',
    borderLeftWidth: 5,
  } as ViewStyle,

});
