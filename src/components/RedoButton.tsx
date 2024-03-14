import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { IconButton } from './IconButton';
import { Player } from '../constants';
import { RootState } from '../store';

interface IProps {
  player: Player;
}

export function RedoButton(props: IProps) {
  const { player } = props;

  const showRedo = useSelector(
    (state: RootState) =>
      state.player.future.length > 0 && state.player.present.currentPlayer === player,
  );

  const dispatch = useDispatch();

  if (!showRedo) {
    return null;
  }

  const redo = () => dispatch(ActionCreators.redo());

  return <IconButton player={player} iconType="Redo" onPress={redo} />;
}
