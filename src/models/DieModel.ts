import { DieValue } from './DieValue';

export interface DieModel {
  value: DieValue;
  isSpent?: boolean;
}
