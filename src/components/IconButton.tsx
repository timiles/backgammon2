import { GestureResponderEvent, Pressable, View } from 'react-native';

import Player from '../models/Player';
import styles from '../styles';

interface IOwnProps {
  player: Player;
  icon: JSX.Element;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export default function IconButton(props: IOwnProps) {
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
