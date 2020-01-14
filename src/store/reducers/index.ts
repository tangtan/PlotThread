import { StateType, ActionType } from '../../types';
import { combineReducers } from 'redux';

import toolState from './toolbar/toolState';
import groupEventState from './groupEvent/groupEventState';
import styleEventState from './styleEvent/styleEventState';
import renderQueue from './canvas/renderQueue';

export default combineReducers<StateType, ActionType>({
  toolState: toolState,
  groupEventState: groupEventState,
  styleEventState: styleEventState,
  renderQueue: renderQueue
});
