import {
  Path,
  Matrix,
  Point,
  CompoundPath,
  Item,
  project,
  PaperScope,
  Color,
  Segment
} from 'paper';
import { StoryName, StoryLine, StorySegment } from '../types';
import BaseDrawer from './baseDrawer';
import TextDrawer from './textDrawer';
import BaseAnimator from '../animators/baseAnimator';
import { ColorPicker } from '../utils/color';

export default class StoryDrawer extends BaseDrawer {
  cfg: any;
  storylineName: string;
  storylinePath: StoryLine;
  prevStoryline: Path[];
  animationType: string;
  constructor(cfg: any) {
    super(cfg);
    this.cfg = cfg || {};
    this.storylineName = cfg.storylineName || 'unknown';
    this.storylinePath = cfg.storylinePath || [];
    this.prevStoryline = cfg.prevStoryline || [];
    this.animationType = cfg.animationType || 'creation';
  }
  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    const { storylineName, storylinePath, prevStoryline, animationType } = this;
    const compoundPath = this._drawStorySegments(
      storylineName,
      storylinePath,
      prevStoryline,
      animationType
    );
    const textLabels = this._drawStoryName(storylineName, compoundPath);
    return [...textLabels, compoundPath];
  }

  _drawStorySegments(
    name: StoryName,
    storyline: StoryLine,
    prevStoryline: Path[],
    animationType: string
  ) {
    const strokes = storyline.map((storySegment: StorySegment) => {
      const pathStr = DrawUtil.getPathStr('sketch', storySegment);
      let path = new Path(pathStr);
      path.simplify();
      path.onMouseDrag = (e: paper.MouseEvent) => {
        this.dragMouse(e, path);
      };
      path.onMouseEnter = () => {
        path.selected = true;
      };
      path.onMouseLeave = () => {
        path.selected = false;
      };
      path.visible = false;
      return path;
    });
    BaseAnimator.Animate(animationType, strokes, prevStoryline);
    return new CompoundPath({
      name: name,
      children: strokes,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor
    });
  }
  dragMouse(e: paper.MouseEvent, path: Path, limits = 6) {
    if (path.segments) {
      if (path.segments.length < limits) {
        this._smoothDragPath(path, path.firstSegment, 0);
        this._smoothDragPath(path, path.lastSegment, 1);
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
      let pathStr = DrawUtil.getSmoothPathStrBetween(firstSegment, nxtSeg);
      this._shiftDragPath(pathStr, path, 0);

      let lastSegment = path.lastSegment;
      let prvSeg = lastSegment.previous.previous;
      pathStr = DrawUtil.getSmoothPathStrBetween(prvSeg, lastSegment);
      this._shiftDragPath(pathStr, path, 1);
    }
  }
  _shiftDragPath(pathStr: string, path: Path, type: number) {
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
  _smoothDragPath(
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
  _drawStoryName(name: StoryName, path: CompoundPath) {
    const firstSegment = path.firstSegment.point || new Point(0, 0);
    const x0 = firstSegment.x || this.originPointX;
    const y0 = firstSegment.y || this.originPointY;
    let cfg = this.cfg;
    cfg.defaultContent = name;
    const textDrawer = new TextDrawer(cfg);
    const texts = textDrawer._drawVisualObjects('text', false, x0, y0);
    return texts;
  }
}

class DrawUtil {
  constructor() {}

  static getPathStr(type: string, line: StorySegment) {
    return type === 'sketch'
      ? this.getSketchPathStr(line)
      : this.getSmoothPathStr(line);
  }
  static getSketchPathStr(line: StorySegment) {
    let points = line;
    let pathStr = `M ${points[0][0]} ${points[0][1]} `;
    let i, len;
    for (i = 1, len = points.length; i < len; i++) {
      pathStr += `L ${points[i][0]} ${points[i][1]}`;
    }
    return pathStr;
  }
  static getSmoothPathStrBetween(lSegment: Segment, rSegment: Segment) {
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
  static getSmoothPathStr(line: StorySegment) {
    let points = line;
    let pathStr = `M ${points[0][0]} ${points[0][1]} `;
    let i, len;
    for (i = 1, len = points.length; i < len - 1; i += 2) {
      const rPoint = points[i];
      const lPoint = points[i + 1];
      const middleX = (rPoint[0] + lPoint[0]) / 2;
      pathStr += `L ${rPoint[0]} ${rPoint[1]} `;
      if (rPoint[1] !== lPoint[1]) {
        pathStr += `C ${middleX} ${rPoint[1]} ${middleX} ${lPoint[1]} ${lPoint[0]} ${lPoint[1]} `;
      } else {
        pathStr += `L ${lPoint[0]} ${lPoint[1]} `;
      }
    }
    pathStr += `L ${points[i][0]} ${points[i][1]}`;
    return pathStr;
  }
}
