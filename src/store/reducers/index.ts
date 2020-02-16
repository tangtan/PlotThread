import { StateType, ActionType } from '../../types';
import { combineReducers } from 'redux';

import toolState from './toolbar/toolState';
import renderQueue from './canvas/renderQueue';
import historyQueue from './canvas/historyQueue';

export default combineReducers<StateType, ActionType>({
  toolState: toolState,
  renderQueue: renderQueue,
  historyQueue: historyQueue
});
