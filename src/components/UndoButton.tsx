import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import IconButton from './IconButton';
import UndoIcon from '../icons/UndoIcon';
import Player from '../models/Player';
import { RootState } from '../store';
import { getOtherPlayer } from '../utils';

interface IProps {
  player: Player;
}

export default function UndoButton(props: IProps) {
  const { player } = props;

  // Show if Player has ever rolled dice that wasn't the initial roll
  const showUndo = useSelector((state: RootState) =>
    [...state.dice.past, state.dice.present].some(
      (x) => !x.isInitialRoll && x.dice[player].length > 0,
    ),
  );

  // Can undo if: either this Player has dice that have remaining moves,
  // or the other Player hasn't yet rolled their own dice
  const canUndo = useSelector(
    (state: RootState) =>
      showUndo &&
      (state.dice.present.dice[player].some((x) => x.remainingMoves > 0) ||
        state.dice.present.dice[getOtherPlayer(player)].length === 0),
  );

  const dispatch = useDispatch();

  const undo = () => dispatch(UndoActionCreators.undo());

  if (showUndo) {
    return (
      <IconButton
        player={player}
        onPress={undo}
        disabled={!canUndo}
        icon={<UndoIcon width={20} fill="white" />}
      />
    );
  }
  return null;
}
