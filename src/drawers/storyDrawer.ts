import { Path, Matrix, Point, CompoundPath, Item } from 'paper';
import { StoryName, StoryLine, StorySegment } from '../types';
import BaseDrawer from './baseDrawer';
import TextDrawer from './textDrawer';

export default class StoryDrawer extends BaseDrawer {
  cfg: any;
  storylineName: string;
  storylinePath: StoryLine;
  prevStoryline: Path[];
  drawType: string;
  constructor(cfg: any) {
    super(cfg);
    this.cfg = cfg || {};
    this.storylineName = cfg.storylineName || 'unknown';
    this.storylinePath = cfg.storylinePath || [];
    this.prevStoryline = cfg.prevStoryline || [];
    this.drawType = cfg.drawType || 'new';
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    const { storylineName, storylinePath, prevStoryline, drawType } = this;
    const compoundPath = this._drawStorySegments(
      storylineName,
      storylinePath,
      prevStoryline,
      drawType
    );
    const textLabels = this._drawStoryName(storylineName, compoundPath);
    return [...textLabels, compoundPath];
  }

  _drawStorySegments(
    name: StoryName,
    storyline: StoryLine,
    prevStoryline: Path[],
    drawType: string
  ) {
    const strokes = storyline.map((storySegment: StorySegment) => {
      const pathStr = DrawUtil.getPathStr('sketch', storySegment);
      const path = new Path(pathStr);
      path.simplify();
      path.visible = false;
      return path;
    });
    if (drawType === 'new') TweenUtil.TweenNew(strokes);
    else TweenUtil.TweenUpdate(strokes, prevStoryline);
    return new CompoundPath({
      name: name,
      children: strokes,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth
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

class TweenUtil {
  constructor() {}

  static TweenBetweenTwoPath(
    path: Path,
    pathTo: Path,
    cnt: number,
    duration = 200
  ) {
    // synchronize two paths
    const segments = path.segments || [];
    const segmentsTo = pathTo.segments || [];
    while (segments.length !== segmentsTo.length) {
      const lastIndex = segments.length - 1;
      const lastSegment = path.lastSegment;
      if (segments.length > segmentsTo.length) {
        path.removeSegment(lastIndex);
      } else {
        path.add(lastSegment);
      }
    }

    // tween two paths
    const pathFrom = path.clone({ insert: false }) as Path;
    setTimeout(
      function(path: Path, pathFrom: Path, pathTo: Path) {
        path.tween(duration).onUpdate = (e: any) => {
          path.visible = true;
          path.interpolate(pathFrom, pathTo, e.factor);
        };
      },
      (cnt + 1) * duration,
      path,
      pathFrom,
      pathTo
    );
    return cnt + 1;
  }
  static ChangeBetweenTwoPath(path: Path, pathTo: Path, duration = 200) {
    const segments = path.segments || [];
    const segmentsTo = pathTo.segments || [];
    while (segments.length !== segmentsTo.length) {
      const lastIndex = segments.length - 1;
      const lastSegment = path.lastSegment;
      if (segments.length > segmentsTo.length) {
        path.removeSegment(lastIndex);
      } else {
        path.add(lastSegment);
      }
    }

    // tween two paths
    const pathToTo = pathTo.clone({ insert: false }) as Path;
    pathTo.tween(duration).onUpdate = (e: any) => {
      pathTo.interpolate(path, pathToTo, e.factor);
      pathTo.visible = true;
    };
  }
  static TweenUpdate(strokes: Path[], prevStoryline: Path[]) {
    for (let i = 0; i < strokes.length; i++) {
      if (i < prevStoryline.length) {
        this.ChangeBetweenTwoPath(prevStoryline[i], strokes[i]);
      } else {
        strokes[i].visible = true;
      }
    }
  }
  static async TweenNew(strokes: Path[], duration = 1000) {
    let cnt = 0;
    while (cnt < strokes.length) {
      cnt = await this.TweenFromFirstSegment(
        strokes[cnt],
        cnt,
        duration / strokes.length
      );
    }
  }
  static async TweenFromFirstSegment(path: Path, cnt: number, duration = 200) {
    // path.set({ insert: false });
    const pathTo = path.clone({ insert: false }) as Path;
    const firstSegment = path.firstSegment;
    const segments = path.segments || [];
    segments.forEach(segment => {
      const point = segment.point as Point;
      const oldX = point.x as number;
      const oldY = point.y as number;
      const newPoint = firstSegment.point as Point;
      const newX = newPoint.x as number;
      const newY = newPoint.y as number;
      const moveMat = new Matrix(1, 0, 0, 1, newX - oldX, newY - oldY);
      segment.transform(moveMat);
    });
    cnt = await TweenUtil.TweenBetweenTwoPath(path, pathTo, cnt, duration);
    pathTo.remove();
    return cnt;
  }
}
