import paper, { Path, Item, Point, project } from 'paper';
import { IHitOption } from '../types';
import { BLACK } from './color';

export class BaseMouseUtil {
  startPosition: Point | null;
  endPosition: Point | null;
  // selected storyline
  selectPath: Item | null;
  // interaction paths
  currPath: Path | null;
  // paper hitTest option
  hitOption: IHitOption;
  constructor(hitOption: IHitOption) {
    this.startPosition = null;
    this.endPosition = null;
    this.selectPath = null;
    this.currPath = null;
    this.hitOption = hitOption;
  }

  restore() {
    if (this.selectPath) {
      this.selectPath.strokeColor = BLACK;
      this.selectPath = null;
    }
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  mouseUp(e: paper.MouseEvent) {
    this.endPosition = e.point;
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  mouseDown(e: paper.MouseEvent) {
    this.startPosition = e.point;
    if (project && e.point) {
      const hitResult = project.hitTest(e.point, this.hitOption);
      if (hitResult) {
        this.selectPath = hitResult.item;
      }
    }
  }

  mouseDrag(e: paper.MouseEvent) {
    this.endPosition = e.point;
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  findStorylineByPosition(
    nodes: number[][][],
    names: string[],
    x: number,
    y: number
  ) {
    let min_y = -1;
    let res = -1;
    nodes.forEach((line, index) => {
      line.forEach((node, pos) => {
        if (node[0] >= x && pos > 0 && line[pos - 1][0] < x) {
          const start_x = line[pos - 1][0];
          const start_y = line[pos - 1][1];
          const end_x = line[pos][0];
          const end_y = line[pos][1];
          const pos_y =
            start_y + ((end_y - start_y) * (x - start_x)) / (end_x - start_x);
          if ((min_y == -1 || pos_y > min_y) && pos_y < y) {
            min_y = pos_y;
            res = index;
          }
        }
      });
    });
    return res === -1 ? '' : names[res];
  }

  findTimespanByPosition(nodes: number[][][], x: number, y: number) {}
}

export class StoryStore {
  nodes: number[][][];
  names: string[];
  constructor(nodes: number[][][], names: string[]) {
    this.nodes = nodes;
    this.names = names;
  }

  getIndexByPosition(x: number, y: number) {
    let min_y = -1;
    let res = -1;
    this.nodes.forEach((line, index) => {
      line.forEach((node, pos) => {
        if (node[0] >= x && pos > 0 && line[pos - 1][0] < x) {
          const start_x = line[pos - 1][0];
          const start_y = line[pos - 1][1];
          const end_x = line[pos][0];
          const end_y = line[pos][1];
          const pos_y =
            start_y + ((end_y - start_y) * (x - start_x)) / (end_x - start_x);
          if ((min_y == -1 || pos_y > min_y) && pos_y < y) {
            min_y = pos_y;
            res = index;
          }
        }
      });
    });
    return res;
  }

  getTimespanByPosition(x: number, y: number) {}

  getStorylineNameByPosition(x: number, y: number) {
    const index = this.getIndexByPosition(x, y);
    return index === -1 ? '' : this.names[index];
  }
}
