import { ActionType, VisualObject } from '../../../types';
import { Group } from 'paper';
import StoryDrawer from '../../../drawers/storyDrawer';
import ShapeDrawer from '../../../drawers/shapeDrawer';
import ImageDrawer from '../../../drawers/imageDrawer';
import PathDrawer from '../../../drawers/pathDrawer';
import TextDrawer from '../../../drawers/textDrawer';

const initialState: VisualObject[] = [];

const errorMsg = 'Incorrect render type';

const drawVisualObject = (type: string, cfg?: any) => {
  const _cfg = cfg || {};
  switch (type) {
    case 'circle':
    case 'ellipse':
    case 'triangle':
    case 'rectangle':
    case 'pentagon':
    case 'hexagon':
      const shapeDrawer = new ShapeDrawer(_cfg);
      return shapeDrawer.draw(type);
    case 'text':
      const textDrawer = new TextDrawer(_cfg);
      return textDrawer.draw(type);
    case 'line':
      const pathDrawer = new PathDrawer(_cfg);
      return pathDrawer.draw(type);
    case 'freeline':
    case 'polyline':
      const complexPathDrawer = new PathDrawer(_cfg);
      return complexPathDrawer.draw(type, true);
    case 'storyline':
      const storyDrawer = new StoryDrawer(_cfg);
      return storyDrawer.draw(type);
    default:
      if (type.startsWith('data:image')) {
        const imageDrawer = new ImageDrawer(_cfg);
        return imageDrawer.draw(type);
      }
      console.error(`${errorMsg}: ${type}`);
      return new Group();
  }
};

export default (state = initialState, action: ActionType) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const { type, cfg } = action.payload;
      const object = drawVisualObject(type, cfg);
      if (object) {
        const visualObj: VisualObject = {
          type: type,
          mounted: true,
          geometry: object
        };
        // object.data = visualObj;
        newState.push(visualObj);
      }
      return newState;
    case 'ADD_VISUALARRAY':
      const { array, cfgs } = action.payload;
      array.forEach((type, index) => {
        const object = drawVisualObject(type, cfgs[index]);
        if (object) {
          // object.position = new Point(100 + 100 * index, 100);
          const visualObj: VisualObject = {
            type: 'image',
            mounted: true,
            geometry: object
          };
          // object.data = visualObj;
          newState.push(visualObj);
        }
      });
      return newState;
    default:
      return state;
  }
};
