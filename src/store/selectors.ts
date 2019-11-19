import { StateType } from '../types';
import { project } from 'paper';

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

// get selected (isTransforming === true) visual objects
export const getSelectedVisualObjects = (state: StateType) => {
  const selectedGroups = state.renderQueue.filter(
    item => item.data.isTransforming === true
  );
  if (!project) return selectedGroups;
  if (!project.activeLayer.children) return selectedGroups;
  const selectedItems = project.activeLayer.children.filter(
    item => item.data.isTransforming === true
  );
  return selectedGroups.length < selectedItems.length
    ? selectedItems
    : selectedGroups;
};
