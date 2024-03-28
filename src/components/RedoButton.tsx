import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { IconButton } from './IconButton';
import { Player } from '../constants';
import { RootState } from '../store';
import { renderBoard } from '../store/actions';

interface IProps {
  player: Player;
}

export function RedoButton(props: IProps) {
  const { player } = props;

  const futureBoard = useSelector((state: RootState) => state.board.future[0]?.board);

  const { currentPlayer } = useSelector((state: RootState) => state.player.present);

  const dispatch = useDispatch();

  if (!futureBoard || currentPlayer !== player) {
    return null;
  }

  const redo = () => {
    dispatch(ActionCreators.redo());
    dispatch(renderBoard({ board: futureBoard }));
  };

  return <IconButton player={player} iconType="Redo" onPress={redo} />;
}
