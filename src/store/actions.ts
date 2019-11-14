import { createAction, action } from 'typesafe-actions';
import { PathGroup } from '../types';
import { Path, Color, Point } from 'paper';

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
  action => (type: string, cfg?: any) => action({ type: type, cfg: cfg || {} })
);

export const addVisualArray = createAction(
  'ADD_VISUALARRAY',
  action => (array: string[], cfgs?: any[]) =>
    action({ array: array, cfgs: cfgs || [] })
);
