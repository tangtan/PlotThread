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
  constructor(cfg: any) {
    super(cfg);
    this.cfg = cfg || {};
    this.storylineName = cfg.storylineName || 'unknown';
    this.storylinePath = cfg.storylinePath || [];
    this.prevStoryline = cfg.prevStoryline || [];
    this.animationType = cfg.animationType || 'creation';
    this.characterID = cfg.characterID || -1;
    this.segmentIDs = cfg.segmentIDs || [];
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
      segmentIDs
    } = this;
    const compoundPath = this._drawStorySegments(
      storylineName,
      storylinePath,
      prevStoryline,
      characterID,
      animationType,
      segmentIDs
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
    segmentIDs: number[]
  ) {
    const strokes = storyline.map((storySegment: StorySegment) => {
      const pathStr = DrawUtil.getPathStr('sketch', storySegment);
      let path = new Path(pathStr);
      path.simplify();
      path.visible = false;
      path.data.characterID = characterID;
      return path;
    });
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
