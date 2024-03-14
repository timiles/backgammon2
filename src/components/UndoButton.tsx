import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { IconButton } from './IconButton';
import { Player } from '../constants';
import { RootState } from '../store';
import { getOtherPlayer } from '../utils';

interface IProps {
  player: Player;
}

export function UndoButton(props: IProps) {
  const { player } = props;

  const { past, present, future } = useSelector((state: RootState) => state.dice);
  const { currentPlayer } = useSelector((state: RootState) => state.player.present);

  const hasRolledDice = present.dice.map((d) => d.length === 2);
  const playerHasMoved = past.length > 0;
  const playerHasUndone = future.length > 0;

  const showUndo =
    (playerHasMoved || playerHasUndone) &&
    (player === currentPlayer ? hasRolledDice[player] : !hasRolledDice[getOtherPlayer(player)]);

  const dispatch = useDispatch();

  if (!showUndo) {
    return null;
  }

  const canUndo = showUndo && playerHasMoved;

  const undo = () => dispatch(ActionCreators.undo());

  return <IconButton player={player} iconType="Undo" onPress={undo} disabled={!canUndo} />;
}
