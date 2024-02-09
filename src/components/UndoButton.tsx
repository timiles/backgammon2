import * as React from 'react';
import { connect } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

import IconButton from './IconButton';
import UndoIcon from '../icons/UndoIcon';
import Player from '../models/Player';
import { ApplicationState } from '../store';
import { getOtherPlayer } from '../utils';

interface IOwnProps {
  player: Player;
}

type Props = IOwnProps & StateProps & DispatchProps;

function UndoButton(props: Props) {
  const { player, showUndo, canUndo, undo } = props;
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

const mapStateToProps = ({ dice }: ApplicationState, ownProps: IOwnProps) => ({
  // Show if Player has ever rolled dice that wasn't the initial roll
  showUndo: [...dice.past, dice.present].some(
    (x) => !x.isInitialRoll && x.dice[ownProps.player].length > 0,
  ),
  // Can undo if: either this Player has dice that haven't been spent yet,
  canUndo:
    dice.present.dice[ownProps.player].some((x) => !x?.isSpent) ||
    // or the other Player hasn't yet rolled their own dice
    dice.present.dice[getOtherPlayer(ownProps.player)].length === 0,
});
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = { undo: UndoActionCreators.undo };
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UndoButton);
