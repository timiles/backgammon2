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
        {die2 != null && <Die player={player} value={die2.value} isSpent />}
        <Die
          player={player}
          value={die1 ? die1.value : '?'}
          onPress={handlePress}
        />
      </View>
    );
  }

  const handlePress = (currentPlayer === player) ? () => props.rollDice(player) : null;
  return (
    <View style={styles.diceContainer}>
      {die1 == null
        ? <Die player={player} value="?" onPress={handlePress} />
        : <Die player={player} value={die1.value} isSpent={die1.isSpent} />}
      {die2 == null
        ? <Die player={player} value="?" onPress={handlePress} />
        : <Die player={player} value={die2.value} isSpent={die2.isSpent} />}
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
