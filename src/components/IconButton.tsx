import * as React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Player from '../models/Player';
import styles from '../styles';

interface IOwnProps {
  player: Player;
  icon: JSX.Element;
}

export default function IconButton(props: TouchableOpacityProps & IOwnProps) {
  const { player, icon, ...touchableOpacityProps } = props;

  const disabledStyle = touchableOpacityProps.disabled ? styles.disabledButton : null;

  const colorStyle = player === Player.Red ? styles.redButton : styles.blackButton;
  const touchableStyle = [styles.iconButton, touchableOpacityProps.style, colorStyle];

  return (
    <View style={disabledStyle}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <TouchableOpacity {...touchableOpacityProps} style={touchableStyle}>
        <View style={styles.iconButtonContent}>
          {icon}
        </View>
      </TouchableOpacity>
    </View>
  );
}
