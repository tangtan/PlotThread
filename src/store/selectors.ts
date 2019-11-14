import { StateType } from '../types';

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

// get selected visual objects
export const getSelectedVisualObjects = (state: StateType) => {
  return state.renderQueue.filter(item => item.selected === true);
};
