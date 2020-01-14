import { ActionType, GroupEventStateType } from '../../../types';

const initialState: GroupEventStateType = {
  groupEventName: '',
  groupEventMap: new Map()
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_GROUP_EVENT': {
      const { name, use } = action.payload;
      const { groupEventMap } = state;
      // 互斥其他工具
      for (let [key, val] of groupEventMap) {
        groupEventMap.set(key, false);
      }
      groupEventMap.set(name, use);
      return {
        ...state,
        groupEventName: name,
        groupEventMap: groupEventMap
      };
    }
    default:
      return state;
  }
};
