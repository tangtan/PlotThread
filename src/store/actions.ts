import { createAction, action } from 'typesafe-actions';

// Tool Module
export const setTool = createAction(
  'SET_TOOL',
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

export const newPredictAction = createAction(
  'NEW_PREDICT',
  action => (newPredictQueue?: any[]) =>
    action({ newPredictQueue: newPredictQueue || [] })
);

export const redoAction = createAction('REDO', action => (cfg?: any) =>
  action({ cfg: cfg || {} })
);

export const undoAction = createAction('UNDO', action => (cfg?: any) =>
  action({ cfg: cfg || {} })
);

export const addAction = createAction(
  'ADD',
  action => (protoc: any, layout: any, scale: number) =>
    action({ protoc: protoc, layout: layout, scale: scale })
);

export const changeLayoutAction = createAction(
  'CHANGE_LAYOUT',
  action => (characterID: number, segmentID: number, deltaY: number) =>
    action({ characterID: characterID, segmentID: segmentID, deltaY: deltaY })
);

export const updateProtocAction = createAction(
  'UPDATE_PROTOC',
  action => (protoc: any) => action({ protocol: protoc })
);

export const newProtocAction = createAction('NEW_PROTOC', action => (id: any) =>
  action({ id: id })
);

export const updateLayoutAction = createAction(
  'UPDATE_LAYOUT',
  action => (storyLayout: any) => action({ storyLayout: storyLayout })
);

export const nextPredictAction = createAction('NEXT_PREDICT', action => () =>
  action({})
);

export const lastPredictAction = createAction('LAST_PREDICT', action => () =>
  action({})
);

export const recordPointerAction = createAction(
  'RECORD_POINTER',
  action => (originalPointer: number) =>
    action({ originalPointer: originalPointer })
);
export const backPointerAction = createAction('BACK_POINTER', action => () =>
  action({})
);
export const forwardPointerAction = createAction(
  'FORWARD_POINTER',
  action => () => action({})
);
export const abandonPointerAction = createAction(
  'ABANDON_POINTER',
  action => () => action({})
);
