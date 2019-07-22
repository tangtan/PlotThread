import { ActionType, ToolStateType } from '../../../types';

const initialState: ToolStateType = {
  toolName: '',
  addLine: false,
  group: false,
  sort: false,
  bend: false,
  scale: false,
  reshape: false,
  move: false
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_TOOL': {
      const { name, use } = action.payload;
      return {
        ...state,
        toolName: name,
        addLine: name === 'AddLine' ? use : false,
        group: name === 'Group' ? use : false,
        sort: name === 'Sort' ? use : false,
        bend: name === 'Bend' ? use : false,
        scale: name === 'Scale' ? use : false,
        reshape: name === 'Reshape' ? use : false,
        move: name === 'Move' ? use : false
      };
    }
    default:
      return state;
  }
};
