import { BAR_POINT_INDEX, OFF_POINT_INDEX, Player } from '../constants';

export function getOtherPlayer(player: Player): Player {
  return ((player + 1) % 2) as Player;
}

export function getOtherPlayersIndex(index: number): number {
  switch (index) {
    case BAR_POINT_INDEX:
    case OFF_POINT_INDEX:
      return index;
    default:
      return 25 - index;
  }
}

export function getPlayersPointIndex(player: Player, index: number): number {
  return player === Player.Red ? index : getOtherPlayersIndex(index);
}
