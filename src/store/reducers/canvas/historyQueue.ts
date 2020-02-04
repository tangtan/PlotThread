import { ActionType } from '../../../types';

const initialState = {
  configArray: [],
  pointer: 0
};

export default (state = initialState, action: ActionType) => {
  const { configArray } = state;
  switch (action.type) {
    case 'UNDO':
      return {
        ...state,
        pointer: state.pointer + 1,
        configArray: configArray
      };

    case 'REDO':
      return {
        ...state,
        pointer: state.pointer - 1,
        configArray: configArray
      };

    //其他的action也记录到historyQueue当中
    default:
      return state;
  }
};
