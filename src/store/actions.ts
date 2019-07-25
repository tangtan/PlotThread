import { createAction, action } from 'typesafe-actions';
import { VisualObject } from '../types';
import { Path, Color, Point } from 'paper';

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

// SelectedObj Module
export const setObject = createAction('SET_OBJECT', action => (point: Point) =>
  action({ point: point })
);

export const setObjectStrokeColor = createAction(
  'SET_OBJECTSTROKECOLOR',
  action => (color: Color) => action({ color: color })
);

export const setObjectFillColor = createAction(
  'SET_OBJECTFILLCOLOR',
  action => (color: Color) => action({ color: color })
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

export const addStoryLines = createAction(
  'ADD_STORYLINES',
  action => (strokes: Path[]) => action({ strokes: strokes })
);
