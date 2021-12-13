import { StateType } from '../types';
import { project, Color } from 'paper';

// Tool Module
export const getToolState = (state: StateType, name: string) => {
  const { toolName, toolMap } = state.toolState;
  if (name === 'FreeMode') {
    return toolName.length === 0 || toolName === 'FreeMode'
      ? true
      : !toolMap.get(toolName);
  }

  return toolMap.has(name) ? toolMap.get(name) : false;
};

export const getToolName = (state: StateType) => {
  return state.toolState.toolName;
};

// get selected (isTransforming === true || isSelected === true) visual objects
// storyline, text, freetext: isSelected
// others: isTransforming
export const getSelectedVisualObjects = (state: StateType) => {
  const selectedGroups = state.renderQueue.filter(
    item => item.data.isTransforming === true || item.selected === true
  );
  if (!project) return selectedGroups;
  if (!project.activeLayer.children) return selectedGroups;
  const selectedItems = project.activeLayer.children.filter(
    item => item.data.isTransforming === true || item.selected === true
  );
  return selectedGroups.length < selectedItems.length
    ? selectedItems
    : selectedGroups;
};

export const getSelectedItemColor = (state: StateType, type: string) => {
  const selectedItems = getSelectedVisualObjects(state);
  let _selectedItems = selectedItems.map(item => item);
  return pickColorFromSelectedItems(
    _selectedItems,
    type === 'StrokeColor',
    type === 'FillColor'
  );
};

function pickColorFromSelectedItems(
  items: any[],
  strokeColor: boolean,
  fillColor: boolean
) {
  const defaultColor = new Color(0.9, 0.9, 0.9, 0.9);
  if (items.length === 0) {
    return defaultColor.toCSS(true);
  }
  let color;
  if (strokeColor) {
    color = BSFSearch(items, 'strokeColor');
  }
  if (fillColor) {
    color = BSFSearch(items, 'fillColor');
  }
  const opColor = color || defaultColor;
  return opColor.toCSS(true);
}

// 会破坏原数组，最好用一个域外变量来记录队列
function BSFSearch(nodes: any[], style = 'fillColor'): Color | undefined {
  if (nodes.length === 0) return undefined;
  const firstNode = nodes.shift();
  const color =
    style === 'fillColor' ? firstNode.fillColor : firstNode.strokeColor;
  if (color) return color;
  if (firstNode.children) {
    nodes.push(...firstNode.children);
  }
  return BSFSearch(nodes, style);
}

// Story Module
export const getStoryStore = (state: StateType) => {
  return state.storyState.storyStore;
};
