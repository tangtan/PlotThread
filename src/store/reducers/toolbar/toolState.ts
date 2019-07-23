import { ActionType, ToolStateType } from '../../../types';

const initialState: ToolStateType = {
  toolName: '',
  toolMap: new Map()
  // addLine: false,
  // group: false,
  // sort: false,
  // bend: false,
  // scale: false,
  // reshape: false,
  // move: false
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_TOOL': {
      const { name, use } = action.payload;
      const { toolMap } = state;
      // 互斥其他工具
      for (let [key, val] of toolMap) {
        toolMap.set(key, false);
      }
      toolMap.set(name, use);
      return {
        ...state,
        toolName: name,
        toolMap: toolMap
        // addLine: name === 'AddLine' ? use : false,
        // group: name === 'Group' ? use : false,
        // sort: name === 'Sort' ? use : false,
        // bend: name === 'Bend' ? use : false,
        // scale: name === 'Scale' ? use : false,
        // reshape: name === 'Reshape' ? use : false,
        // move: name === 'Move' ? use : false
      };
    }
    default:
      return state;
  }
};
