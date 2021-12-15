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

export const deselectVisualObjects = createAction(
  'DESELECT_VISUALOBJECTS',
  action => () => action({})
);

export const cleanVisualObjects = createAction(
  'CLEAN_VISUALOBJECTS',
  action => () => action({})
);

// Story Module
export const loadStoryFile = createAction(
  'LOAD_STORYFILE',
  action => (fileUrl: string, fileType: string) =>
    action({ fileUrl: fileUrl, fileType: fileType })
);

export const loadStoryJson = createAction(
  'LOAD_STORYJSON',
  action => (storyName: string, storyJson: any) =>
    action({ storyName: storyName, storyJson: storyJson })
);

export const bendStorylines = createAction(
  'BEND_STORYLINES',
  action => (args: any) => action({ args: args })
);

export const sortStorylines = createAction(
  'SORT_STORYLINES',
  action => (args: any) => action({ args: args })
);

export const compressStorylines = createAction(
  'COMPRESS_STORYLINES',
  action => (args: any) => action({ args: args })
);
