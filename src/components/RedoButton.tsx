import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import IconButton from './IconButton';
import { Player } from '../constants';
import RedoIcon from '../icons/RedoIcon';
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

  const redo = () => dispatch(ActionCreators.redo());

  if (showRedo) {
    return (
      <IconButton player={player} onPress={redo} icon={<RedoIcon width={20} fill="white" />} />
    );
  }
  return null;
}
