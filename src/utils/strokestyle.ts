import {
  PathStyleSegment,
  StoryLine,
  StoryName,
  PathGroup,
  StorySegment
} from '../types';
export default class StrokeStyle {
  styles: PathStyleSegment[];
  stylesIndex: number[];
  constructor() {
    this.styles = [];
    this.stylesIndex = [];
  }
  static pointInLine(x: number, l: number[], r: number[]) {
    return [x, ((r[1] - l[1]) * (x - l[0])) / (r[0] - l[0]) + l[1]];
  }
  static cut(path: StorySegment, left: number, right: number) {
    const res: StorySegment = [];
    let i = 0;
    for (; i < path.length; ++i) {
      if (path[i][0] >= left) {
        break;
      }
    }
    if (i >= path.length) {
      return res;
    }
    if (i != 0 && path[i][0] > left) {
      res.push(this.pointInLine(left, path[i - 1], path[i]));
    }
    for (; i < path.length; ++i) {
      if (path[i][0] > right) {
        break;
      }
      res.push(path[i]);
    }
    if (i < path.length && path[i - 1][0] < right) {
      res.push(this.pointInLine(right, path[i - 1], path[i]));
    }
    return res;
  }
  public convert = (nodes: StoryLine[], names: StoryName[]) => {
    this.stylesIndex = [];
    this.styles.forEach((style, styleIndex) => {
      const index = names.indexOf(style.name);
      if (index != -1) {
        const line = nodes[index];
        for (let key = 0; key < line.length; ++key) {
          const path = line[key];
          if (
            path[0][0] < style.left &&
            style.right < path[path.length - 1][0]
          ) {
            line.push(StrokeStyle.cut(path, path[0][0], style.left));
            line.push(StrokeStyle.cut(path, style.right, path[path.length][0]));
            line[key] = StrokeStyle.cut(path, style.left, style.right);
            this.stylesIndex[styleIndex] = key;
            break;
          }
        }
      }
    });
    return nodes;
  };
  public draw = (storyStrokes: PathGroup[], names: StoryName[]) => {
    this.styles.forEach((style, styleIndex) => {
      if (this.stylesIndex[styleIndex] != undefined) {
        const pos = this.stylesIndex[styleIndex];
        const index = names.indexOf(style.name);
        style.draw(storyStrokes[index][pos]);
      }
    });
  };
}
