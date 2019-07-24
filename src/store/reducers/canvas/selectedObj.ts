import { ActionType, VisualObject } from '../../../types';
import { project } from 'paper';

const initialState: VisualObject = {
  type: 'circle',
  mounted: false,
  geometry: null
};

const hitOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'SET_OBJECT':
      const { e } = action.payload;
      if (project && e.point) {
        const hitRes = project.hitTest(e.point, hitOption);
        if (!hitRes) {
          return state;
        }
        const hitItem = hitRes.item;
        if (!hitItem) {
          return state;
        }
        const newState = hitItem.data as VisualObject;
        return newState;
      }
      return state;
    default:
      return state;
  }
};
