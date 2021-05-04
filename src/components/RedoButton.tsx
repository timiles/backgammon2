import * as React from 'react';
import { connect } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import RedoIcon from '../icons/RedoIcon';
import Player from '../models/Player';
import { ApplicationState } from '../store';
import IconButton from './IconButton';

interface IOwnProps {
  player: Player;
}

type Props = IOwnProps & StateProps & DispatchProps;

function RedoButton(props: Props) {
  const { player, showRedo, redo } = props;
  if (showRedo) {
    return (
      <IconButton
        player={player}
        onPress={redo}
        icon={<RedoIcon width={20} fill="white" />}
      />
    );
  }
  return null;
}

const mapStateToProps = ({ player }: ApplicationState, ownProps: IOwnProps) => (
  {
    showRedo: (player.future.length > 0) && (player.present.currentPlayer === ownProps.player),
  }
);
type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = { redo: UndoActionCreators.redo };
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RedoButton);
