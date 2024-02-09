import { DieValue } from './DieValue';

export interface DieModel {
  value: DieValue;
  isHalfSpent?: boolean;
  isSpent?: boolean;
}
