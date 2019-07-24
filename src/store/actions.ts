import { createAction, action } from 'typesafe-actions';
import { VisualObject } from '../types';

let nextTodoId: number = 0;

// Todo demo
export const addTodo = createAction('ADD_TODO', action => (content: string) =>
  action({ id: ++nextTodoId, content: content })
);

export const toggleTodo = createAction('TOGGLE_TODO', action => (id: number) =>
  action({ id: id })
);

export const setFilter = createAction(
  'SET_FILTER',
  action => (filter: string) => action({ filter: filter })
);

// Tool Module
export const setTool = createAction(
  'SET_TOOL',
  action => (name: string, use: boolean) => action({ name: name, use: use })
);

// Render Module
export const addVisualObject = createAction(
  'ADD_VISUALOBJECT',
  action => (type: string) => action({ type: type })
);
export const addVisualArray = createAction(
  'ADD_VISUALARRAY',
  action => (array: string[]) => action({ array: array })
);
