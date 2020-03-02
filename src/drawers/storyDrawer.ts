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
import { StoryStore } from '../utils/storyStore';

export default class StoryDrawer extends BaseDrawer {
  cfg: any;
  storylineName: string;
  storylinePath: StoryLine;
  prevStoryline: Path[];
  characterID: number;
  animationType: string;
  segmentIDs: number[];
  dashIDs: number[];
  constructor(cfg: any) {
    super(cfg);
    this.cfg = cfg || {};
    this.storylineName = cfg.storylineName || 'unknown';
    this.storylinePath = cfg.storylinePath || [];
    this.prevStoryline = cfg.prevStoryline || [];
    this.animationType = cfg.animationType || 'creation';
    this.characterID = cfg.characterID || -1;
    this.segmentIDs = cfg.segmentIDs || [];
    this.dashIDs = cfg.dashIDs || [];
  }
  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    const {
      storylineName,
      storylinePath,
      prevStoryline,
      characterID,
      animationType,
      segmentIDs,
      dashIDs
    } = this;
    const compoundPath = this._drawStorySegments(
      storylineName,
      storylinePath,
      prevStoryline,
      characterID,
      animationType,
      segmentIDs,
      dashIDs
    );
    const textLabels = this._drawStoryName(storylineName, compoundPath);
    return [...textLabels, compoundPath];
  }

  _drawStorySegments(
    name: StoryName,
    storyline: StoryLine,
    prevStoryline: Path[],
    characterID: number,
    animationType: string,
    segmentIDs: number[],
    dashIDs: number[]
  ) {
    let strokes = [];
    for (let i = 0; i < storyline.length; i++) {
      let flag = 1;
      for (let j = 0; j < dashIDs.length; j++) {
        if (i === dashIDs[j]) {
          flag = 0;
          break;
        }
      }
      let pathStr = '';
      if (flag) {
        pathStr = DrawUtil.getPathStr('sketch', storyline[i]);
      } else {
        pathStr = DrawUtil.getPathStr('dash', storyline[i]);
      }
      let path = new Path(pathStr);
      path.simplify();
      //path.smooth();
      path.visible = false;
      path.data.characterID = characterID;
      strokes.push(path);
    }
    BaseAnimator.Animate(animationType, strokes, prevStoryline, segmentIDs);
    return new CompoundPath({
      name: name,
      children: strokes,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor
    });
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
      : 'dash'
      ? this.getDashPathStr(line)
      : this.getSmoothPathStr(line);
  }
  static getDashPathStr(line: StorySegment) {
    let points = line;
    let pathStr = ``;
    let i, len;
    let length, size;
    for (i = 0, len = points.length; i < len - 1; i++) {
      length = Math.sqrt(
        (points[i][0] - points[i + 1][0]) * (points[i][0] - points[i + 1][0]) +
          (points[i][1] - points[i + 1][1]) * (points[i][1] - points[i + 1][1])
      );
      size = Math.ceil(length / 5);
      if (!(size & 1)) size += 1;
      let vec = [
        (points[i + 1][0] - points[i][0]) / size,
        (points[i + 1][1] - points[i][1]) / size
      ];
      for (let j = 0; j < size; j++) {
        if (j & 1) {
          pathStr += `L ${points[i][0] + vec[0] * j} ${points[i][1] +
            vec[1] * j} `;
        } else {
          pathStr += `M ${points[i][0] + vec[0] * j} ${points[i][1] +
            vec[1] * j} `;
        }
      }
    }
    return pathStr;
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
