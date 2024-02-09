import { BoxModel } from './BoxModel';
import { CounterModel } from './CounterModel';

export interface CounterContainerModel {
  counters: CounterModel[];
  box?: BoxModel;
}
