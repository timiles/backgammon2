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

class Dice extends React.Component<Props> {
  handleRollDie = () => {
    const { player, rollInitialDie } = this.props;
    rollInitialDie(player);
  };

  render() {
    const {
      player, dice: [die1, die2], requiresReroll, currentPlayer,
    } = this.props;

    const isInitialRoll = (currentPlayer == null);
    return (
      <View style={styles.diceContainer}>
        {die2 != null && <Die player={player} value={die2.value} isSpent={die2.isSpent} />}
        {die1 == null && (
          <Die player={player} value="?" onPress={isInitialRoll ? this.handleRollDie : null} />
        )}
        {die1 != null && (
          <Die
            player={player}
            value={die1.value}
            isSpent={die1.isSpent}
            onPress={requiresReroll ? this.handleRollDie : null}
          />
        )}
      </View>
    );
  }
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
