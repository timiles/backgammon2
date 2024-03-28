import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { IconButton } from './IconButton';
import { Player } from '../constants';
import { RootState } from '../store';
import { renderBoard } from '../store/actions';
import { getOtherPlayer } from '../utils/playerUtils';

interface IProps {
  player: Player;
}

export function UndoButton(props: IProps) {
  const { player } = props;

  const pastBoard = useSelector((state: RootState) => state.board.past.at(-1)?.board);
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

  const undo = () => {
    if (pastBoard) {
      dispatch(ActionCreators.undo());
      dispatch(renderBoard({ board: pastBoard }));
    }
  };

  const canUndo = showUndo && playerHasMoved;

  return <IconButton player={player} iconType="Undo" onPress={undo} disabled={!canUndo} />;
}
