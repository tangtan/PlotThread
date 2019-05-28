import { createAction, action } from 'typesafe-actions';

let nextTodoId: number = 0;

export const addTodo = createAction('ADD_TODO', action => content =>
  action({ id: ++nextTodoId, content: content })
);

export const toggleTodo = createAction('TOGGLE_TODO', action => id =>
  action({ id: id })
);

export const setFilter = createAction('SET_FILTER', action => filter =>
  action({ filter: filter })
);
