import { Player } from '../constants';

export function getOtherPlayer(player: Player): Player {
  return ((player + 1) % 2) as Player;
}

export function getOtherPlayersIndex(index: number): number {
  return 25 - index;
}
