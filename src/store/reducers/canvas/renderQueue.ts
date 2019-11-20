import { ActionType, VisualObject } from '../../../types';
import { Group, Rectangle } from 'paper';
import StoryDrawer from '../../../drawers/storyDrawer';
import ShapeDrawer from '../../../drawers/shapeDrawer';
import ImageDrawer from '../../../drawers/imageDrawer';
import PathDrawer from '../../../drawers/pathDrawer';
import TextDrawer from '../../../drawers/textDrawer';
import IMouseEvent from '../../../interactions/IMouseEvent';
import { drawSelectionBounds } from '../../../drawers/baseDrawer';

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
    case 'freetext':
      return _cfg as Group;
    case 'line':
      const pathDrawer = new PathDrawer(_cfg);
      return pathDrawer.draw(type);
    case 'freeline':
    case 'polyline':
      return _cfg as Group;
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

// 绑定单个 Visual Object 的鼠标交互事件，例如 translate，rotate，scale 等
const onVisualObject = (visualObj: Group) => {
  const bounds = visualObj.internalBounds as Rectangle;
  if (visualObj.data.selectionBounds) visualObj.data.selectionBounds.remove();
  visualObj.data.selectionBounds = drawSelectionBounds(bounds);
  visualObj.data.selectionBounds.visible = visualObj.data.isTransforming;
  const mouseUtil = new IMouseEvent(visualObj);
  visualObj.onMouseEnter = (e: any) => {
    mouseUtil.enter(e);
  };
  visualObj.onMouseLeave = (e: any) => {
    mouseUtil.leave(e);
  };
  visualObj.onMouseDown = (e: any) => {
    mouseUtil.down(e);
  };
  visualObj.onMouseMove = (e: any) => {
    mouseUtil.move(e);
  };
  visualObj.onMouseUp = (e: any) => {
    mouseUtil.up(e);
  };
  visualObj.onMouseDrag = (e: any) => {
    mouseUtil.drag(e);
  };
  visualObj.onClick = (e: any) => {
    mouseUtil.click(e);
  };
};

export default (state = initialState, action: ActionType) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const { type, cfg } = action.payload;
      const object = drawVisualObject(type, cfg);
      onVisualObject(object);
      if (object) {
        newState.push(object);
      }
      return newState;
    case 'ADD_VISUALARRAY':
      const { array, cfgs } = action.payload;
      array.forEach((type, index) => {
        const object = drawVisualObject(type, cfgs[index]);
        onVisualObject(object);
        if (object) {
          newState.push(object);
        }
      });
      return newState;
    default:
      return state;
  }
};
