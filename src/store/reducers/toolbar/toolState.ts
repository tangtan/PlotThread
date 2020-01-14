import { ActionType, ToolStateType } from '../../../types';

const initialState: ToolStateType = {
  toolName: '',
  toolMap: new Map()
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
      };
    }
    default:
      return state;
  }
};
