import { Player } from '../constants';

export interface CheckerModel {
  id: string;
  player: Player;
  pointIndex: number;
  location: { x: number; y: number };
}
