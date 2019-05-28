import { ActionType, TodosType } from '../../../types';

const initialState: TodosType = {
  allIds: [],
  byIds: {}
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'ADD_TODO': {
      const { id, content } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, id],
        byIds: {
          ...state.byIds,
          [id]: {
            id: id,
            content: content,
            completed: false
          }
        }
      };
    }
    case 'TOGGLE_TODO': {
      const { id } = action.payload;
      return {
        ...state,
        byIds: {
          ...state.byIds,
          [id]: {
            ...state.byIds[id],
            completed: !state.byIds[id].completed
          }
        }
      };
    }
    default:
      return state;
  }
};
