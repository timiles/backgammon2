import * as React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../colors';
import { PlayerId } from '../models/PlayerId';
import { ApplicationState } from '../store';
import styles from '../styles';

interface IOwnProps {
  playerId: PlayerId;
}

type Props = IOwnProps & StateProps;

function Status(props: Props) {
  const { playerId, recentStatus } = props;

  const rotation = playerId === 2 ? styles.player2Rotation : null;
  const color = playerId === 1 ? colors.Player1 : colors.Player2;

  return (
    <View style={rotation}>
      <Text style={[styles.statusText, { color }]}>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <Text style={styles.playerText}>{color.toUpperCase()}:</Text> {recentStatus}
      </Text>
    </View>
  );
}

const mapStateToProps = ({ statuses }: ApplicationState, ownProps: IOwnProps) => {
  const playerStatuses = statuses.statuses[ownProps.playerId - 1];
  return ({ recentStatus: playerStatuses[playerStatuses.length - 1] });
};
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Status);
