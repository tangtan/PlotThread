import { StateType, ActionType } from '../../types';
import { combineReducers } from 'redux';
import { action } from 'typesafe-actions';
import todos from './demo/todos';
import visibilityFilter from './demo/visibilityFilter';

export default combineReducers<StateType, ActionType>({
  todos: todos,
  visibilityFilter: visibilityFilter
});
