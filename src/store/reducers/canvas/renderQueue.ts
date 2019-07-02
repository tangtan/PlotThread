import { ActionType, VisualObject } from '../../../types';
import { Point, Path, Size } from 'paper';

const initialState: VisualObject[] = [];

const errorMsg = 'Incorrect render type';

const drawVisualObject = (type: string) => {
  switch (type) {
    case 'circle':
      return drawCircle(type);
    case 'rectangle':
      return drawRectangle(type);
    default:
      return null;
  }
};

const drawCircle = (type: string) => {
  if (type === 'circle') {
    const center = new Point(100, 100);
    const radius = 50;
    const circle = new Path.Circle(center, radius);
    circle.strokeColor = 'black';
    circle.fillColor = 'white';
    return circle;
  } else {
    throw `${errorMsg} (${type}).`;
  }
};

const drawRectangle = (type: string) => {
  if (type === 'rectangle') {
    const anchor = new Point(50, 50);
    const size = new Size(100, 100);
    const rect = new Path.Rectangle(anchor, size);
    rect.strokeColor = 'black';
    rect.fillColor = 'white';
    return rect;
  } else {
    throw `${errorMsg} (${type}).`;
  }
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const { type } = action.payload;
      const newState = [...state];
      const visualObj: VisualObject = {
        type: type,
        mounted: true,
        geometry: drawVisualObject(type)
      };
      newState.push(visualObj);
      return newState;
    default:
      return state;
  }
};
