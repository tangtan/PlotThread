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

  // TODO: add name
  up(e: paper.MouseEvent) {
    if (this.currPath) {
      this.currPath.remove();
    }
    if (this.storyStore && this.startPosition && this.endPosition) {
      const startX = this.startPosition.x as number;
      const startY = this.startPosition.y as number;
      const startTime = this.storyStore.getStoryTimeSpan(startX, startY);
      const endX = this.endPosition.x as number;
      const endY = this.endPosition.y as number;
      const endTime = this.storyStore.getStoryTimeSpan(endX, endY);
      const id = Math.ceil(Math.random() * 100);
      this.characterInfo.push([`storyline-${id}`, startTime, endTime]);
    }
  }

  // draw a horizontal line
  drag(e: paper.MouseEvent) {
    if (e.point && this.currPath) {
      this.currPath.add(e.point);
    }
  }
}
