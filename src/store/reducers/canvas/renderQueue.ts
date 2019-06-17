import { ActionType, VisualObject } from '../../../types';

const initialState: VisualObject[] = [];

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const visualObj = action.payload;
      const newState = [...state];
      newState.push(visualObj);
      return newState;
    default:
      return state;
  }
};
