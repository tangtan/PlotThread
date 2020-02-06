import { ActionType, StyleEventStateType } from '../../../types';

const initialState: StyleEventStateType = {
  styleEventName: '',
  styleEventMap: new Map()
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_STYLE_EVENT': {
      const { name, use } = action.payload;
      const { styleEventMap } = state;
      // 互斥其他工具
      for (let [key, val] of styleEventMap) {
        styleEventMap.set(key, false);
      }
      styleEventMap.set(name, use);
      return {
        ...state,
        groupEventName: name,
        groupEventMap: styleEventMap
      };
    }
    default:
      return state;
  }
};
