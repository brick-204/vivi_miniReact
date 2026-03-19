import { Action } from 'shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}