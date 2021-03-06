import Player from './models/Player';

export function getOtherPlayer(player: Player): Player {
  return (player + 1) % 2 as Player;
}

export function getDistance(player: Player, sourceIndex: number, destinationIndex: number) {
  return (destinationIndex - sourceIndex) * (player === Player.Red ? 1 : -1);
}
