/* eslint-disable import/prefer-default-export */
import Player from './models/Player';

export function getOtherPlayer(player: Player): Player {
  return (player + 1) % 2 as Player;
}
