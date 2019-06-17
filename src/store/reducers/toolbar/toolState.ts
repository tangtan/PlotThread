import { ActionType, ToolStateType } from '../../../types';

const initialState: ToolStateType = {
  toolName: '',
  move: false,
  morph: false,
  adjust: false,
  bend: false,
  stroke: false,
  picture: false
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_TOOL': {
      const { name, use } = action.payload;
      return {
        ...state,
        toolName: name,
        move: name === 'move' ? use : false,
        morph: name === 'morph' ? use : false,
        adjust: name === 'adjust' ? use : false,
        bend: name === 'bend' ? use : false,
        stroke: name === 'stroke' ? use : false,
        picture: name === 'picture' ? use : false
      };
    }
    default:
      return state;
  }
};
