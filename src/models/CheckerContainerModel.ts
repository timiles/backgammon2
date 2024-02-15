import { BoxModel } from './BoxModel';
import { CheckerModel } from './CheckerModel';

export interface CheckerContainerModel {
  checkers: CheckerModel[];
  box?: BoxModel;
}
