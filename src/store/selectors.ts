import { VISIBILITY_FILTERS } from '../components/demo/constants';
import { StateType } from '../types';

// demos
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

// toolbar module
export const getToolState = (state: StateType, name: string) => {
  const { toolName, toolMap } = state.toolState;
  if (name === 'FreeMode') {
    return toolName.length === 0 ? true : !toolMap.get(toolName);
  }
  return toolMap.has(name) ? toolMap.get(name) : false;
};

export const getToolName = (state: StateType) => {
  return state.toolState.toolName;
};

// selectedObj module
export const getSelectedObjMountState = (state: StateType) => {
  return state.selectedObj.mounted;
};

export const getSelectedObjType = (state: StateType) => {
  return state.selectedObj.type;
};

export const getSelectedObjGeometry = (state: StateType) => {
  const { mounted, geometry } = state.selectedObj;
  return mounted ? geometry : null;
};

export const getSelectedObjStrokeColor = (state: StateType) => {
  const { mounted, type, geometry } = state.selectedObj;
  if (type === 'image') {
    return null;
  }
  if (mounted && geometry) {
    // If geometry is group
    if (geometry.children && geometry.children.length > 0) {
      return geometry.children[0].strokeColor;
    }
    // otherwise, geometry is path
    return geometry.strokeColor;
  }
  return null;
};

export const getSelectedObjFillColor = (state: StateType) => {
  const { mounted, type, geometry } = state.selectedObj;
  if (type === 'image') {
    return null;
  }
  if (mounted && geometry) {
    if (geometry.children && geometry.children.length > 0) {
      return geometry.children[0].strokeColor;
    }
    return geometry.fillColor;
  }
  return null;
};
