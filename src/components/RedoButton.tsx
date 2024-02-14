import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import IconButton from './IconButton';
import RedoIcon from '../icons/RedoIcon';
import Player from '../models/Player';
import { RootState } from '../store';

interface IProps {
  player: Player;
}

export default function RedoButton(props: IProps) {
  const { player } = props;

  const showRedo = useSelector(
    (state: RootState) =>
      state.player.future.length > 0 && state.player.present.currentPlayer === player,
  );

  const dispatch = useDispatch();

  const redo = () => dispatch(UndoActionCreators.redo());

  if (showRedo) {
    return (
      <IconButton player={player} onPress={redo} icon={<RedoIcon width={20} fill="white" />} />
    );
  }
  return null;
}
