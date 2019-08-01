import { BaseMouseUtil } from '../util';
import { IHitOption, StorySegment, StoryName, StoryGraph } from '../../types';
import paper, { Path } from 'paper';
import { ColorSet } from '../color';

export default class AddLineUtil extends BaseMouseUtil {
  characterInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.characterInfo = [];
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
    if (this.currPath) {
      this.currPath.remove();
    }
    this.currPath = new Path();
    this.currPath.strokeColor = ColorSet.black;
    this.currPath.strokeWidth = 2;
  }

  // TODO
  up(e: paper.MouseEvent) {
    if (this.currPath) {
      this.currPath.remove();
    }
    const id = Math.ceil(Math.random() * 100);
    this.characterInfo.push([`TT-${id}`, 1, 100]);
  }

  // draw a horizontal line
  drag(e: paper.MouseEvent) {
    if (e.point && this.currPath) {
      this.currPath.add(e.point);
    }
  }
}
