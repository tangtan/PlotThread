import { ActionType, VisualObject } from '../../../types';
import { Group, Rectangle, PointText, Path, Segment, Point } from 'paper';
import StoryDrawer from '../../../drawers/storyDrawer';
import ShapeDrawer from '../../../drawers/shapeDrawer';
import ImageDrawer from '../../../drawers/imageDrawer';
import PathDrawer from '../../../drawers/pathDrawer';
import TextDrawer from '../../../drawers/textDrawer';
import IMouseEvent from '../../../interactions/IMouseEvent';
import { drawSelectionBounds } from '../../../drawers/baseDrawer';
import { type } from 'os';

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
  const strokes = storyline.children ? storyline.children[1].children : null;
  const bounds = storyline.internalBounds as Rectangle;
  if (storyline.data.selectionBounds) storyline.data.selectionBounds.remove();
  storyline.data.selectionBounds = drawSelectionBounds(bounds);
  storyline.data.selectionBounds.visible = storyline.data.isTransforming;
  const mouseUtil = new IMouseEvent(storyline);
  if (textLabel) {
    textLabel.onClick = (e: any) => {
      mouseUtil.click(e);
    };
    textLabel.onMouseDrag = (e: any) => {
      mouseUtil.drag(e);
    };
  }
  if (strokes) {
    strokes.forEach(path => {
      path.onMouseDrag = (e: paper.MouseEvent) => {
        dragMouse(e, path as Path);
      };
      path.onMouseEnter = () => {
        path.selected = true;
      };
      path.onMouseLeave = () => {
        path.selected = false;
      };
    });
  }
};
function dragMouse(e: paper.MouseEvent, path: Path, limits = 6) {
  if (path.segments) {
    if (path.segments.length < limits) {
      smoothDragPath(path, path.firstSegment, 0);
      smoothDragPath(path, path.lastSegment, 1);
    }
    for (let i = 2; i < path.segments.length - 2; i++) {
      let segment = path.segments[i];
      let deltaY = e.delta ? (e.delta.y ? e.delta.y : 0) : 0;
      if (segment.point) {
        let prevY = segment.point.y as number;
        segment.point.y = prevY + deltaY;
      }
    }
    let firstSegment = path.firstSegment;
    let nxtSeg = firstSegment.next.next;
    let pathStr = getSmoothPathStrBetween(firstSegment, nxtSeg);
    shiftDragPath(pathStr, path, 0);

    let lastSegment = path.lastSegment;
    let prvSeg = lastSegment.previous.previous;
    pathStr = getSmoothPathStrBetween(prvSeg, lastSegment);
    shiftDragPath(pathStr, path, 1);
  }
}
function shiftDragPath(pathStr: string, path: Path, type: number) {
  let newPath = new Path(pathStr);
  if (newPath.segments && path.segments) {
    if (type) {
      path.removeSegment(path.segments.length - 1);
      path.removeSegment(path.segments.length - 1);
      path.add(new Segment(newPath.segments[1]));
      path.add(new Segment(newPath.segments[2]));
    } else {
      path.removeSegment(0);
      path.removeSegment(0);
      path.insert(0, new Segment(newPath.segments[2]));
      path.insert(0, new Segment(newPath.segments[1]));
    }
  }
  newPath.remove();
}
function getSmoothPathStrBetween(lSegment: Segment, rSegment: Segment) {
  let pathStr = ``;
  if (lSegment.point) {
    let prevX = lSegment.point.x as number;
    let prevY = lSegment.point.y as number;
    if (rSegment.point) {
      let nextX = rSegment.point.x as number;
      let nextY = rSegment.point.y as number;
      const middleX = (nextX + prevX) / 2;
      pathStr = `M ${prevX - 10} ${prevY} L ${prevX} ${prevY}`;
      pathStr += `C ${middleX} ${prevY} ${middleX} ${nextY} ${nextX} ${nextY} L ${nextX +
        10} ${nextY}`;
    }
  }
  return pathStr;
}
function smoothDragPath(
  path: Path,
  segment: Segment,
  type: number,
  smoothRate = 0.4
) {
  let middleX = 0;
  let middleY = 0;
  if (segment.point) {
    let prevX = segment.point.x as number;
    let prevY = segment.point.y as number;
    let nxtSeg = type ? segment.previous : segment.next;
    let deltaX = 0;
    if (nxtSeg) {
      if (nxtSeg.point) {
        let nextX = nxtSeg.point.x as number;
        deltaX = nextX - prevX;
        segment.point.x = prevX + deltaX * smoothRate;
        middleX = (prevX + segment.point.x) / 2;
        middleY = prevY;
        if (type) {
          path.add(new Point(middleX, middleY));
          path.add(new Point(prevX, prevY));
        } else {
          path.insert(0, new Point(middleX, middleY));
          path.insert(0, new Point(prevX, prevY));
        }
      }
    }
  }
}
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
