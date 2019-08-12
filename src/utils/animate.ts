import { Path, Matrix, Point, Group, Style } from 'paper';
import {
  StoryName,
  StoryLine,
  StorySegment,
  StoryGraph,
  PathGroup
} from '../types';
import { ColorSet } from './color';
import StrokeStyle from './strokestyle';

export default class StoryDrawer {
  // TODO: using a group of paths to draw storyline
  storyStrokes: PathGroup[];
  type: string;
  names: StoryName[];
  nodes: StorySegment[];
  renderNodes: StoryLine[];
  smoothNodes: StoryLine[];
  sketchNodes: StoryLine[];
  styleUtil: StrokeStyle | null;
  constructor() {
    this.storyStrokes = [];
    this.type = 'sketch';
    this.names = [];
    this.nodes = [];
    this.renderNodes = [];
    this.smoothNodes = [];
    this.sketchNodes = [];
    this.styleUtil = null;
  }

  initGraph(graph: StoryGraph) {
    let type = this.type;
    this.names = graph.names;
    this.nodes = graph.nodes;
    this.renderNodes = graph.renderNodes || [];
    this.smoothNodes = graph.smoothNodes || [];
    this.sketchNodes = graph.sketchNodes || [];
    this.draw(type);
    return this.storyStrokes;
  }

  // TODO: using Storyline[]
  draw(type = 'render') {
    let nodes = this.renderNodes; // default case
    switch (type) {
      case 'render':
        nodes = this.renderNodes;
        break;
      case 'smooth':
        nodes = this.smoothNodes;
        break;
      case 'sketch':
        nodes = this.sketchNodes;
        break;
      default:
        nodes = this.renderNodes;
        break;
    }
    if (this.styleUtil) {
      this.styleUtil.convert(nodes, this.names);
    }
    const storyStrokes = nodes.map((storyline, i) =>
      this.drawStoryline(this.names[i], storyline, type)
    );
    if (this.styleUtil) {
      this.styleUtil.draw(storyStrokes, this.names);
    }
    this.storyStrokes = storyStrokes;
  }

  drawStoryline(name: StoryName, storyline: StoryLine, type: string) {
    return storyline.map(storySegment =>
      this.drawStorySegment(name, storySegment, type)
    );
  }

  // TODO: draw with a group of paths
  drawStorySegment(name: StoryName, line: StorySegment, type: string) {
    const pathStr = DrawUtil.getPathStr(type, line);
    const path = new Path(pathStr);
    if (type === 'sketch') {
      path.simplify();
    }
    path.name = name;
    path.strokeCap = 'round';
    path.strokeJoin = 'round';
    path.strokeColor = ColorSet.black;
    path.strokeWidth = 1;
    return path;
  }

  updateGraph(graph: StoryGraph) {
    let type = this.type;
    this.names = graph.names;
    this.nodes = graph.nodes;
    this.renderNodes = graph.renderNodes || [];
    this.smoothNodes = graph.smoothNodes || [];
    this.sketchNodes = graph.sketchNodes || [];
    this.update(type);
    // console.log(project);
    return this.storyStrokes;
  }

  update(type = 'render') {
    let nodes = this.renderNodes; // default case
    switch (type) {
      case 'render':
        nodes = this.renderNodes;
        break;
      case 'smooth':
        nodes = this.smoothNodes;
        break;
      case 'sketch':
        nodes = this.sketchNodes;
        break;
      default:
        nodes = this.renderNodes;
        break;
    }
    if (this.styleUtil) {
      this.styleUtil.convert(nodes, this.names);
    }
    const storyStrokes = nodes.map((storyline, i) =>
      this.updateStoryline(this.names[i], storyline, type)
    );
    if (this.styleUtil) {
      this.styleUtil.draw(storyStrokes, this.names);
    }
    this.storyStrokes = storyStrokes;
    return this.storyStrokes;
  }

  updateStoryline(name: StoryName, storyline: StoryLine, type: string) {
    return storyline.map((storySegment, i) =>
      this.updateStorySegment(name, i, storySegment, type)
    );
  }

  updateStorySegment(
    name: StoryName,
    index: number,
    line: StorySegment,
    type: string
  ) {
    const path = this.getStoryStrokeByName(name, index);
    if (path) {
      const newPathStr = DrawUtil.getPathStr(type, line);
      const pathTo = new Path(newPathStr);
      if (type === 'sketch') {
        pathTo.simplify();
      }
      TweenUtil.TweenBetweenTwoPath(path, pathTo);
      // IMPORTANT: remove temp animation paths
      pathTo.remove();
      return path;
    } else {
      const newPath = this.drawStorySegment(name, line, type);
      TweenUtil.TweenFromFirstSegment(newPath);
      return newPath;
    }
  }

  getStoryStrokeByName(name: StoryName, index: number): Path | null {
    for (let i = 0, len = this.storyStrokes.length; i < len; i++) {
      const stroke = this.storyStrokes[i];
      const strokeName = stroke[0].name;
      if (strokeName === name && index < stroke.length) {
        return stroke[index];
      }
    }
    return null;
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
        pathStr += `C ${middleX} ${rPoint[1]} ${middleX} ${lPoint[1]} ${
          lPoint[0]
        } ${lPoint[1]} `;
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

  static TweenBetweenTwoPath(path: Path, pathTo: Path, duration = 1000) {
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
    path.tween(duration).onUpdate = (e: any) => {
      path.interpolate(pathFrom, pathTo, e.factor);
    };
  }

  static TweenFromFirstSegment(path: Path, duration = 1000) {
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
    TweenUtil.TweenBetweenTwoPath(path, pathTo, duration);
    pathTo.remove();
  }
}
