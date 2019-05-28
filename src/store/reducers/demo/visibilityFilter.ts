import { VISIBILITY_FILTERS } from '../../../components/demo/constants';
import { ActionType } from '../../../types';

const initialState = VISIBILITY_FILTERS.ALL;

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_FILTER': {
      return action.payload.filter;
    }
    default:
      return state;
  }
};
