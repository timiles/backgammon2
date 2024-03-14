import { GestureResponderEvent, Pressable, View } from 'react-native';

import { Player } from '../constants';
import { Icon, IconType } from '../icons';
import { styles } from '../styles';

interface IProps {
  player: Player;
  iconType: IconType;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function IconButton(props: IProps) {
  const { player, iconType, onPress, disabled } = props;

  const disabledStyle = disabled ? styles.disabledButton : null;

  const colorStyle = player === Player.Red ? styles.redButton : styles.blackButton;
  const pressableStyle = [styles.iconButton, colorStyle, disabledStyle];

  return (
    <Pressable disabled={disabled} onPress={onPress} style={pressableStyle}>
      <View style={styles.iconButtonContent}>
        <Icon type={iconType} width={20} fill="white" />
      </View>
    </Pressable>
  );
}
