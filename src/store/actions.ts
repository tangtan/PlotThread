import { createAction, action } from 'typesafe-actions';

// Tool Module
export const setTool = createAction(
  'SET_TOOL',
  action => (name: string, use: boolean) => action({ name: name, use: use })
);

export const setGroupEvent = createAction(
  'SET_GROUP_EVENT',
  action => (name: string, use: boolean) => action({ name: name, use: use })
);

export const setStyleEvent = createAction(
  'SET_STYLE_EVENT',
  action => (name: string, use: boolean) => action({ name: name, use: use })
);

// Render Module
export const addVisualObject = createAction(
  'ADD_VISUALOBJECT',
  action => (type: string, cfg?: any) => action({ type: type, cfg: cfg || {} })
);

export const addVisualArray = createAction(
  'ADD_VISUALARRAY',
  action => (array: string[], cfgs?: any[]) =>
    action({ array: array, cfgs: cfgs || [] })
);

export const redoAction = createAction('REDO', action => () => action({}));

export const undoAction = createAction('UNDO', action => () => action({}));
