import { ActionType, historyQueueType } from '../../../types';

const initialState: historyQueueType = {
  configArray: [1, 2, 3, 4, 5, 6, 7], //暂时写成数字
  pointer: 0
};

export default (state = initialState, action: ActionType) => {
  const { configArray } = state;
  switch (action.type) {
    case 'UNDO':
      if (configArray.length > state.pointer) {
        console.log(configArray[state.pointer + 1]);
        return {
          ...state,
          pointer: state.pointer + 1,
          configArray: configArray
        };
      }
    case 'REDO':
      if (state.pointer > 0) {
        console.log(configArray[state.pointer - 1]);
        return {
          ...state,
          pointer: state.pointer - 1,
          configArray: configArray
        };
      }
    //如果有其他的action也记录到historyQueue当中
    default:
      return state;
  }
};
