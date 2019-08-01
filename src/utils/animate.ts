import { Path, Matrix, Point } from 'paper';
import {
  StoryName,
  StoryLine,
  StorySegment,
  StoryGraph,
  PathGroup
} from '../types';
import { ColorSet } from './color';

export default class StoryDrawer {
  // TODO: using a group of paths to draw storyline
  storyStrokes: PathGroup[];
  names: StoryName[];
  nodes: StorySegment[];
  renderNodes: StoryLine[];
  smoothNodes: StoryLine[];
  sketchNodes: StoryLine[];
  constructor() {
    this.storyStrokes = [];
    this.names = [];
    this.nodes = [];
    this.renderNodes = [];
    this.smoothNodes = [];
    this.sketchNodes = [];
  }

  initGraph(graph: StoryGraph) {
    this.names = graph.names;
    this.nodes = graph.nodes;
    this.renderNodes = graph.renderNodes || [];
    this.smoothNodes = graph.smoothNodes || [];
    this.sketchNodes = graph.sketchNodes || [];
    this.draw();
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
    this.storyStrokes = nodes.map((storyline, i) =>
      this.drawStoryline(this.names[i], storyline)
    );
  }

  drawStoryline(name: StoryName, storyline: StoryLine) {
    return storyline.map(storySegment =>
      this.drawStorySegment(name, storySegment)
    );
  }

  // TODO: draw with a group of paths
  drawStorySegment(name: StoryName, line: StorySegment) {
    const pathStr = this.getSmoothPathStr(line);
    const path = new Path(pathStr);
    path.name = name;
    path.strokeCap = 'round';
    path.strokeJoin = 'round';
    path.strokeColor = ColorSet.black;
    path.strokeWidth = 1;
    return path;
  }

  getSmoothPathStr(line: StorySegment) {
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

  updateGraph(graph: StoryGraph) {
    this.names = graph.names;
    this.nodes = graph.nodes;
    this.renderNodes = graph.renderNodes || [];
    this.smoothNodes = graph.smoothNodes || [];
    this.sketchNodes = graph.sketchNodes || [];
    this.update();
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
    this.storyStrokes = nodes.map((storyline, i) =>
      this.updateStoryline(this.names[i], storyline)
    );
    return this.storyStrokes;
  }

  updateStoryline(name: StoryName, storyline: StoryLine) {
    return storyline.map((storySegment, i) =>
      this.updateStorySegment(name, i, storySegment)
    );
  }

  updateStorySegment(name: StoryName, index: number, line: StorySegment) {
    const path = this.getStoryStrokeByName(name, index);
    if (path) {
      const newPathStr = this.getSmoothPathStr(line);
      const pathTo = new Path(newPathStr);
      TweenUtil.TweenBetweenTwoPath(path, pathTo);
      // IMPORTANT: remove temp animation paths
      pathTo.remove();
    } else {
      const newPath = this.drawStorySegment(name, line);
      TweenUtil.TweenFromFirstSegment(newPath);
      return newPath;
    }
    return path;
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
