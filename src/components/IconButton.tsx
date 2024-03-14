import { GestureResponderEvent, Pressable, View } from 'react-native';

import { Player } from '../constants';
import { styles } from '../styles';

interface IProps {
  player: Player;
  icon: JSX.Element;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function IconButton(props: IProps) {
  const { player, icon, onPress, disabled } = props;

  const disabledStyle = disabled ? styles.disabledButton : null;

  const colorStyle = player === Player.Red ? styles.redButton : styles.blackButton;
  const pressableStyle = [styles.iconButton, colorStyle, disabledStyle];

  return (
    <Pressable disabled={disabled} onPress={onPress} style={pressableStyle}>
      <View style={styles.iconButtonContent}>{icon}</View>
    </Pressable>
  );
}
