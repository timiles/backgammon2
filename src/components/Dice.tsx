import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Die from './Die';
import Player from '../models/Player';
import { ApplicationState } from '../store';
import * as DiceStore from '../store/Dice';
import styles from '../styles';

interface IOwnProps {
  player: Player;
}

type Props = IOwnProps & StateProps & DispatchProps;

function Dice(props: Props) {
  const {
    player,
    dice: [die1, die2],
    isInitialRoll,
    currentPlayer,
  } = props;

  if (currentPlayer == null) {
    const handlePress = isInitialRoll ? () => props.rollInitialDie(player) : null;
    return (
      <View style={styles.diceContainer}>
        <Die player={player} die={die2} disabled={die2 == null} />
        <Die player={player} die={die1} onPress={handlePress} />
      </View>
    );
  }

  const handlePress = currentPlayer === player ? () => props.rollDice(player) : null;
  return (
    <View style={styles.diceContainer}>
      {die1 == null ? (
        <Die player={player} onPress={handlePress} />
      ) : (
        <Die player={player} die={die1} />
      )}
      {die2 == null ? (
        <Die player={player} onPress={handlePress} />
      ) : (
        <Die player={player} die={die2} />
      )}
    </View>
  );
}

const mapStateToProps = ({ dice, player }: ApplicationState, ownProps: IOwnProps) => ({
  dice: dice.present.dice[ownProps.player],
  isInitialRoll: dice.present.isInitialRoll,
  currentPlayer: player.present.currentPlayer,
});
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = DiceStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dice);
