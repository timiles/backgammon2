import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Player from '../models/Player';
import { ApplicationState } from '../store';
import * as DiceStore from '../store/Dice';
import styles from '../styles';
import Die from './Die';

interface IOwnProps {
  player: Player;
}

type Props = IOwnProps & StateProps & DispatchProps;

function Dice(props: Props) {
  const {
    player, dice: [die1, die2], requiresReroll, currentPlayer,
  } = props;

  if (currentPlayer == null) {
    const handlePress = (die1 == null || requiresReroll)
      ? () => props.rollInitialDie(player) : null;
    return (
      <View style={styles.diceContainer}>
        {die2 != null && <Die player={player} die={die2} />}
        <Die player={player} die={die1} onPress={handlePress} />
      </View>
    );
  }

  const handlePress = (currentPlayer === player) ? () => props.rollDice(player) : null;
  return (
    <View style={styles.diceContainer}>
      {die1 == null
        ? <Die player={player} onPress={handlePress} />
        : <Die player={player} die={die1} />}
      {die2 == null
        ? <Die player={player} onPress={handlePress} />
        : <Die player={player} die={die2} />}
    </View>
  );
}

const mapStateToProps = ({ dice, player }: ApplicationState, ownProps: IOwnProps) => (
  {
    dice: dice.dice[ownProps.player],
    requiresReroll: dice.requiresReroll[ownProps.player],
    currentPlayer: player.currentPlayer,
  }
);
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = DiceStore.actionCreators;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Dice);