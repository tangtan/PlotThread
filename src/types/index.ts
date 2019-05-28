import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import VisibilityFilters from '../components/demo/VisibilityFilters';

export type ActionType = ActionType<typeof actions>;

export type StateType = {
  todos: TodosType;
  visibilityFilter: string;
};

export type DispatchType = typeof store.dispatch;

// TodoApp demo
export type ITodo = {
  id: number;
  content: string;
  completed: boolean;
};

export type TodosType = {
  allIds: number[];
  byIds: ByIdsType;
};

export type ByIdsType = {
  [id: number]: ITodo;
};
