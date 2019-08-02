import { BaseMouseUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Color } from 'paper';
import { ColorSet } from '../color';

export default class AddLineUtil extends BaseMouseUtil {
  characterInfo: any[][];
  strokeWidth: number;
  strokeColor: Color;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.characterInfo = [];
    this.strokeWidth = 2;
    this.strokeColor = ColorSet.black;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
    this.createPath();
  }

  // TODO: add name
  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    if (this.storyStore && this.startPosition && this.endPosition) {
      const startX = this.startPosition.x as number;
      const startY = this.startPosition.y as number;
      const startTime = this.storyStore.getStoryTimeSpan(startX, startY)[0];
      const endX = this.endPosition.x as number;
      const endY = this.endPosition.y as number;
      const endTime = this.storyStore.getStoryTimeSpan(endX, endY)[1];
      console.log(startTime, endTime);
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

  createPath() {
    if (this.currPath) {
      this.currPath.remove();
    }
    this.currPath = new Path();
    this.currPath.strokeWidth = this.strokeWidth;
    this.currPath.strokeColor = this.strokeColor;
  }
}
