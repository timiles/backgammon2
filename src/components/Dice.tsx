import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Die from './Die';
import Player from '../models/Player';
import { RootState } from '../store';
import { initialDiceWinner, rollDice, rollInitialDie } from '../store/actions';
import styles from '../styles';
import { getOtherPlayer, getRandomDie } from '../utils';

interface IProps {
  player: Player;
}

export default function Dice(props: IProps) {
  const { player } = props;

  const { dice, isInitialRoll } = useSelector((state: RootState) => state.dice.present);
  const { currentPlayer } = useSelector((state: RootState) => state.player.present);

  const dispatch = useDispatch();

  const [die1, die2] = dice[player];

  if (currentPlayer == null) {
    const handlePress = isInitialRoll
      ? () => {
          const otherPlayer = getOtherPlayer(player);
          const otherPlayersDie = dice[otherPlayer][0];
          const thisPlayersDie = getRandomDie();
          const requiresReroll = otherPlayersDie && thisPlayersDie === otherPlayersDie.value;

          dispatch(
            rollInitialDie({
              player,
              dieValue: thisPlayersDie,
              requiresReroll,
            }),
          );

          // Check if there's a winner of the initial roll
          if (otherPlayersDie != null && otherPlayersDie.value !== thisPlayersDie) {
            setTimeout(() => {
              dispatch(
                initialDiceWinner({
                  winner: thisPlayersDie > otherPlayersDie.value ? player : otherPlayer,
                }),
              );
            }, 1000);
          }
        }
      : null;

    return (
      <View style={styles.diceContainer}>
        <Die player={player} die={die2} disabled={die2 == null} />
        <Die player={player} die={die1} onPress={handlePress} />
      </View>
    );
  }

  const handlePress =
    currentPlayer === player
      ? () => dispatch(rollDice({ player, dieValues: [getRandomDie(), getRandomDie()] }))
      : null;

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
