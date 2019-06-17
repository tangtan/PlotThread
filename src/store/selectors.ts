import { VISIBILITY_FILTERS } from '../components/demo/constants';
import { StateType } from '../types';

export const getTodosState = (state: StateType) => state.todos;

export const getTodoList = (state: StateType) =>
  getTodosState(state) ? getTodosState(state).allIds : [];

export const getTodoById = (state: StateType, id: number) =>
  getTodosState(state) ? { ...getTodosState(state).byIds[id], id } : null;

export const getTodos = (state: StateType) =>
  getTodoList(state).map(id => getTodoById(state, id));

export const getTodosByVisibilityFilter = (
  state: StateType,
  visibilityFilter: string
) => {
  const allTodos = getTodos(state);
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.COMPLETED:
      return allTodos.filter(todo => {
        if (todo) {
          return todo.completed;
        }
      });
    case VISIBILITY_FILTERS.INCOMPLETE:
      return allTodos.filter(todo => {
        if (todo) {
          return !todo.completed;
        }
      });
    default:
      return allTodos;
  }
};

export const getToolState = (state: StateType, name: string) => {
  switch (name) {
    case 'move':
      return state.toolState.move;
    case 'morph':
      return state.toolState.morph;
    case 'adjust':
      return state.toolState.adjust;
    case 'bend':
      return state.toolState.bend;
    case 'stroke':
      return state.toolState.stroke;
    case 'picture':
      return state.toolState.picture;
    default:
      return false;
  }
};
