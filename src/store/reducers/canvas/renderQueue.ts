import { ActionType, VisualObject } from '../../../types';
import { Point, Path, Size, Raster } from 'paper';
import { ColorSet } from '../../../utils/color';

const initialState: VisualObject[] = [];

const errorMsg = 'Incorrect render type';

const drawVisualObject = (type: string) => {
  switch (type) {
    case 'circle':
      return drawCircle(type);
    case 'rectangle':
      return drawRectangle(type);
    default:
      if (type.startsWith('data:image')) {
        return drawRaster(type);
      }
      return null;
  }
};

const drawCircle = (type: string) => {
  if (type === 'circle') {
    const center = new Point(100, 100);
    const radius = 50;
    const circle = new Path.Circle(center, radius);
    circle.strokeColor = ColorSet.black;
    circle.fillColor = ColorSet.white;
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
    rect.strokeColor = ColorSet.black;
    rect.fillColor = ColorSet.white;
    return rect;
  } else {
    throw `${errorMsg} (${type}).`;
  }
};

const drawRaster = (type: string) => {
  const raster = new Raster(type);
  return raster;
};

export default (state = initialState, action: ActionType) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const { type } = action.payload;
      const visualObj: VisualObject = {
        type: type,
        mounted: true,
        geometry: drawVisualObject(type)
      };
      newState.push(visualObj);
      return newState;
    case 'ADD_VISUALARRAY':
      const { array } = action.payload;
      array.forEach((type, index) => {
        const object = drawVisualObject(type);
        if (object) {
          object.position = new Point(100 + 100 * index, 100);
        }
        const visualObj: VisualObject = {
          type: type,
          mounted: true,
          geometry: object
        };
        newState.push(visualObj);
      });
      return newState;
    default:
      return state;
  }
};
