import { ActionType, VisualObject } from '../../../types';
import { project } from 'paper';

const initialState: VisualObject = {
  type: 'group',
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
      const { point } = action.payload;
      if (project && point) {
        const hitRes = project.hitTest(point, hitOption);
        if (!hitRes) {
          return initialState;
        }
        const hitItem = hitRes.item;
        if (!hitItem) {
          return initialState;
        }
        const newState = hitItem.data as VisualObject;
        if (hitItem.data.mounted) {
          return newState;
        } else if (hitItem.parent) {
          return hitItem.parent.data as VisualObject;
        }
      }
      return state;
    case 'SET_OBJECTSTROKECOLOR':
      const { color } = action.payload;
      const { mounted, type, geometry } = state;
      if (type === 'image') {
        return state;
      }
      if (mounted && geometry) {
        geometry.strokeColor = color;
      }
      return state;
    case 'SET_OBJECTFILLCOLOR': {
      const { color } = action.payload;
      const { mounted, type, geometry } = state;
      if (type === 'image') {
        return state;
      }
      if (mounted && geometry) {
        geometry.fillColor = color;
      }
      return state;
    }
    default:
      return state;
  }
};
