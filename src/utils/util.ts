import paper, { Path, Item, Point, project } from 'paper';
import { IHitOption, StoryLine, StoryNode, StoryName } from '../types';
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
  // storyline hitTest
  storyStore: StoryStore;
  constructor(hitOption: IHitOption, nodes: StoryLine[], names: StoryName[]) {
    this.startPosition = null;
    this.endPosition = null;
    this.selectPath = null;
    this.currPath = null;
    this.hitOption = hitOption;
    this.storyStore = new StoryStore(nodes, names);
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
}

// StoryLine HitTest
export class StoryStore {
  nodes: StoryLine[];
  names: StoryName[];
  constructor(nodes: StoryLine[], names: StoryName[]) {
    this.nodes = nodes;
    this.names = names;
  }

  getStoryLine(index: number) {
    return this.nodes[index];
  }

  getStoryLineNameByIndex(index: number) {
    return this.names[index];
  }

  getStoryNodeX(node: StoryNode) {
    return node[0];
  }

  getStoryNodeY(node: StoryNode) {
    return node[1];
  }

  getStoryLineNum() {
    return this.nodes.length;
  }

  getStoryLineIndexByName(name: StoryName) {
    return this.names.indexOf(name);
  }

  getStoryLineNameByPosition(x: number, y: number) {
    const storyLineIndex = this.getStoryLineIndexByPosition(x, y);
    if (storyLineIndex > -1) {
      return this.getStoryLineNameByIndex(storyLineIndex);
    } else {
      return null;
    }
  }

  getStoryLineIndexByPosition(x: number, y: number) {
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
          if ((min_y === -1 || pos_y > min_y) && pos_y < y) {
            min_y = pos_y;
            res = index;
          }
        }
      });
    });
    return res;
  }

  getStoryLineNameNodeRangeWithRectangle(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    const x0Name2Index = this.getStoryNodeIndexByPositionX(x0);
    const x0y0 = this.findRoundStoryNode(y0, x0Name2Index);
    const x1Name2Index = this.getStoryNodeIndexByPositionX(x1);
    const x1y0 = this.findRoundStoryNode(y0, x1Name2Index);
    if (x0y0.length === 2 && x1y0.length === 2) {
      return [...x0y0, ...x1y0];
    }
    return [];
  }

  findRoundStoryNode(y: number, name2Index: Map<string, number>) {
    let minDeltaY = Infinity;
    let minNodeIndex = -1;
    let minStoryLineIndex = -1;
    if (name2Index.size > 0) {
      for (let [name, nodeIndex] of name2Index) {
        const storyLineIndex = this.getStoryLineIndexByName(name);
        if (storyLineIndex > -1) {
          const storyLine = this.getStoryLine(storyLineIndex);
          const storyNode = storyLine[nodeIndex];
          const storyNodeY = this.getStoryNodeY(storyNode);
          const deltaY = Math.abs(y - storyNodeY);
          if (deltaY < minDeltaY) {
            minDeltaY = deltaY;
            minNodeIndex = nodeIndex;
            minStoryLineIndex = storyLineIndex;
          }
        }
      }
    }
    return minNodeIndex > -1 ? [minStoryLineIndex, minNodeIndex] : [];
  }

  getStoryLineNameNodeIndexPairsByVerticalRange(
    x: number,
    y0: number,
    y1: number
  ) {
    const inRangeName2Index = new Map();
    const name2Index = this.getStoryNodeIndexByPositionX(x);
    if (name2Index.size > 0) {
      for (let [name, nodeIndex] of name2Index) {
        const storyLineIndex = this.getStoryLineIndexByName(name);
        if (storyLineIndex > -1) {
          const storyLine = this.getStoryLine(storyLineIndex);
          const storyNode = storyLine[nodeIndex];
          const storyNodeY = this.getStoryNodeY(storyNode);
          if ((storyNodeY - y0) * (storyNodeY - y1) <= 0) {
            inRangeName2Index.set(name, nodeIndex);
          }
        }
      }
    }
    return inRangeName2Index;
  }

  /**
   * get storyline nodes index according to mouseX
   *
   * @param
   *   x: number
   *     mouse position x
   *
   * @return
   *   res: Map
   *     [name, index] pairs
   */
  getStoryNodeIndexByPositionX(x: number) {
    const name2Index = new Map();
    this.names.forEach((name, lineIndex) => {
      const nodeIndex = this.getStoryNodeIndexFromStorySegment(x, lineIndex);
      if (nodeIndex > -1) {
        name2Index.set(name, nodeIndex);
      }
    });
    return name2Index;
  }

  getStoryNodeIndexFromStorySegment(x: number, index: number) {
    if (index >= this.getStoryLineNum()) {
      return -1;
    }
    const storyLine = this.getStoryLine(index);
    for (let i = 0, len = storyLine.length - 1; i < len; i++) {
      const node = storyLine[i];
      const nextNode = storyLine[i + 1];
      if (this.isBetweenTwoStoryNodeByX(node, nextNode, x)) {
        return i;
      }
    }
    return -1;
  }

  isBetweenTwoStoryNodeByX(node1: StoryNode, node2: StoryNode, x: number) {
    return (x - this.getStoryNodeX(node1)) * (x - this.getStoryNodeX(node2)) <=
      0
      ? true
      : false;
  }

  getStorylineNameByPosition(x: number, y: number) {
    const index = this.getStoryLineIndexByPosition(x, y);
    return index === -1 ? '' : this.names[index];
  }
}
