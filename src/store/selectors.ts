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

// selectedObj module
export const getSelectedObjMountState = (state: StateType) => {
  return state.selectedObj.mounted;
};

export const getSelectedObjType = (state: StateType) => {
  return state.selectedObj.type;
};

export const getSelectedObjGeometry = (state: StateType) => {
  const { mounted, geometry } = state.selectedObj;
  return mounted ? geometry : null;
};

export const getSelectedObjStrokeColor = (state: StateType) => {
  const { mounted, type, geometry } = state.selectedObj;
  if (type === 'image') {
    return null;
  }
  if (mounted && geometry) {
    // If geometry is group
    if (geometry.children && geometry.children.length > 0) {
      return geometry.children[0].strokeColor;
    }
    // otherwise, geometry is path
    return geometry.strokeColor;
  }
  return null;
};

export const getSelectedObjFillColor = (state: StateType) => {
  const { mounted, type, geometry } = state.selectedObj;
  if (type === 'image') {
    return null;
  }
  if (mounted && geometry) {
    if (geometry.children && geometry.children.length > 0) {
      return geometry.children[0].strokeColor;
    }
    return geometry.fillColor;
  }
  return null;
};
