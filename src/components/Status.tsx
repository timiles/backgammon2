import * as React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import Player from '../models/Player';
import { ApplicationState } from '../store';
import styles from '../styles';
import { Side } from '../types';

interface IOwnProps {
  player: Player;
  side: Side;
}

type Props = IOwnProps & StateProps;

function Status(props: Props) {
  const { player, side, status } = props;

  const colorStyle = player === Player.Red ? styles.redPlayer : styles.blackPlayer;

  return (
    <View style={side === 'top' ? styles.upsideDown : null}>
      <Text style={[styles.statusText, colorStyle]}>
        <Text style={styles.playerText}>{status && `${Player[player].toUpperCase()}: `}</Text>
        {status || ' '}
      </Text>
    </View>
  );
}

const mapStateToProps = ({ statuses }: ApplicationState, ownProps: IOwnProps) => ({
  status: statuses.present.statuses[ownProps.player],
});
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Status);
