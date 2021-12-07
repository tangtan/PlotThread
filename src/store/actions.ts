import { createAction } from 'typesafe-actions';

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

// Story Module
export const loadStoryFile = createAction(
  'LOAD_STORYFILE',
  action => (fileUrl: string, fileType: string) =>
    action({ fileUrl: fileUrl, fileType: fileType })
);

export const loadStoryJson = createAction(
  'LOAD_STORYJSON',
  action => (story: any) => action({ story: story })
);
