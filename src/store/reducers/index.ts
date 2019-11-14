import { StateType, ActionType } from '../../types';
import { combineReducers } from 'redux';

import toolState from './toolbar/toolState';
import renderQueue from './canvas/renderQueue';

export default combineReducers<StateType, ActionType>({
  toolState: toolState,
  renderQueue: renderQueue
});
