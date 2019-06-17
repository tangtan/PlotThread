import { StateType, ActionType } from '../../types';
import { combineReducers } from 'redux';

import todos from './demo/todos';
import visibilityFilter from './demo/visibilityFilter';

import toolState from './toolbar/toolState';
import renderQueue from './canvas/renderQueue';

export default combineReducers<StateType, ActionType>({
  todos: todos,
  visibilityFilter: visibilityFilter,
  toolState: toolState,
  renderQueue: renderQueue
});
