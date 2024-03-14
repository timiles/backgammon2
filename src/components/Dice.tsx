import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { Die } from './Die';
import { Player } from '../constants';
import { RootState } from '../store';
import { initialDiceWinner, resetInitialDice, rollDice, rollInitialDie } from '../store/actions';
import { styles } from '../styles';
import { canMoveAnyChecker, createDice, getOtherPlayer, getRandomDieValue } from '../utils';

interface IProps {
  player: Player;
}

export function Dice(props: IProps) {
  const { player } = props;

  const { dice, isInitialRoll } = useSelector((state: RootState) => state.dice.present);
  const { currentPlayer } = useSelector((state: RootState) => state.player.present);
  const { board } = useSelector((state: RootState) => state.board.present);

  const dispatch = useDispatch();

  const handlePress = () => {
    if (isInitialRoll) {
      const otherPlayer = getOtherPlayer(player);
      const otherPlayersDie = dice[otherPlayer][0];
      const thisPlayersDieValue = getRandomDieValue();
      const requiresReroll = otherPlayersDie?.value === thisPlayersDieValue;

      dispatch(
        rollInitialDie({
          player,
          dieValue: thisPlayersDieValue,
          requiresReroll,
        }),
      );

      // If both dice are rolled, dispatch the resulting action after a short delay
      if (otherPlayersDie) {
        setTimeout(() => {
          const action = requiresReroll
            ? resetInitialDice()
            : initialDiceWinner({
                winner: thisPlayersDieValue > otherPlayersDie.value ? player : otherPlayer,
              });
          dispatch(action);
          dispatch(ActionCreators.clearHistory());
        }, 1000);
      }
    } else {
      const newDice = createDice([getRandomDieValue(), getRandomDieValue()]);
      const playerCanMove = canMoveAnyChecker(board, newDice, player);
      dispatch(rollDice({ player, dice: newDice, playerCanMove }));
      dispatch(ActionCreators.clearHistory());
    }
  };

  const [die1, die2] = dice[player];

  return (
    <View style={styles.diceContainer}>
      <Die
        player={player}
        die={die2}
        onPress={die2 == null ? handlePress : undefined}
        disabled={isInitialRoll || player !== currentPlayer}
      />
      <Die
        player={player}
        die={die1}
        onPress={die1 == null ? handlePress : undefined}
        disabled={!isInitialRoll && player !== currentPlayer}
      />
    </View>
  );
}
