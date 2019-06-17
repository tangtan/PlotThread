import { ActionType } from 'typesafe-actions';
import * as actions from '../store/actions';
import store from '../store';
import VisibilityFilters from '../components/demo/VisibilityFilters';

export type ActionType = ActionType<typeof actions>;

export type StateType = {
  todos: TodosType;
  visibilityFilter: string;
  toolState: ToolStateType;
  renderQueue: VisualObject[];
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

// Tool State
export type ToolStateType = {
  toolName: string;
  move: boolean;
  morph: boolean;
  adjust: boolean;
  bend: boolean;
  stroke: boolean;
  picture: boolean;
};

// Visual Object
export type VisualObject = {
  type: string;
};
