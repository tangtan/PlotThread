import { ActionType, VisualObject } from '../../../types';
import { Group, Rectangle, Path, Segment, Point } from 'paper';
import StoryDrawer from '../../../drawers/storyDrawer';
import ShapeDrawer from '../../../drawers/shapeDrawer';
import ImageDrawer from '../../../drawers/imageDrawer';
import PathDrawer from '../../../drawers/pathDrawer';
import TextDrawer from '../../../drawers/textDrawer';
import IMouseEvent from '../../../interactions/IMouseEvent';
import dragSegment, {
  updateSegment
} from '../../../interactions/IMouseEvent/segmentEvent';
import { drawSelectionBounds } from '../../../drawers/baseDrawer';
import { updateLayoutAction } from '../../actions';
import { ColorPicker } from '../../../utils/color';

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
    case 'star':
    case 'end':
    case 'appear':
    case 'spark':
    case 'highlight':
    case 'hexagon':
      const shapeDrawer = new ShapeDrawer(_cfg);
      return shapeDrawer.draw(type, false, _cfg.x, _cfg.y);
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
      if (type && type.startsWith('data:image')) {
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

const onStoryline = (storyline: Group) => {
  const textLabel = storyline.children ? storyline.children[0] : null;
  const strokes = storyline.children ? storyline.children.slice(1) : null;
  const bounds = storyline.internalBounds as Rectangle;
  if (storyline.data.selectionBounds) storyline.data.selectionBounds.remove();
  storyline.data.selectionBounds = drawSelectionBounds(bounds);
  storyline.data.selectionBounds.visible = storyline.data.isTransforming;
  const mouseUtil = new IMouseEvent(storyline);
  // storyline nameLabel 全局排序
  if (textLabel) {
    textLabel.onClick = (e: any) => {
      mouseUtil.click(e);
    };
    textLabel.onMouseDrag = (e: any) => {
      mouseUtil.drag(e);
    };
  }
  // storyline segments 局部排序
  if (strokes) {
    for (let i = 0; i < strokes.length; i++) {
      let path = strokes[i];
      path.data.segmentID = i;
      path.onMouseDrag = (e: paper.MouseEvent) => {
        dragSegment(e, path as Path);
      };
      path.onMouseDown = (e: paper.MouseEvent) => {
        path.data.downPoint = e.point;
      };
      path.onMouseUp = (e: paper.MouseEvent) => {
        path.data.dragPoint = e.point;
        updateSegment(path as Path);
      };
      // TODO: easy segment dragger
      path.onMouseEnter = () => {
        path.data.originColor = path.strokeColor;
        path.data.originWidth = path.strokeWidth;
        path.strokeColor = ColorPicker.blue;
        path.strokeWidth = 4;
      };
      path.onMouseLeave = () => {
        path.strokeColor = path.data.originColor;
        path.strokeWidth = path.data.originWidth;
      };
      path.onClick = (e: paper.MouseEvent) => {
        path.selected = true;
        path.data.isTransforming = true;
        e.stopPropagation();
      };
    }
  }
};

export default (state = initialState, action: ActionType) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_VISUALOBJECT':
      const { type, cfg } = action.payload;
      const object = drawVisualObject(type, cfg);
      if (type === 'storyline') onStoryline(object);
      else onVisualObject(object);
      if (object) {
        newState.push(object);
      }
      return newState;
    case 'ADD_VISUALARRAY':
      const { array, cfgs } = action.payload;
      array.forEach((type, index) => {
        const object = drawVisualObject(type, cfgs[index]);
        if (type === 'storyline') onStoryline(object);
        else onVisualObject(object);
        if (object) {
          newState.push(object);
        }
      });
      return newState;
    default:
      return state;
  }
};
