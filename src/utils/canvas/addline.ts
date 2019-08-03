import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Color } from 'paper';
import { ColorSet } from '../color';

export default class AddLineUtil extends StoryUtil {
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
    this.createCurrPath();
  }

  // TODO: add name
  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    const startTime = this.getStartTime();
    const endTime = this.getEndTime();
    if (startTime > -1 && endTime > -1) {
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

  createCurrPath() {
    if (this.currPath) {
      this.currPath.remove();
    }
    this.currPath = new Path();
    this.currPath.strokeWidth = this.strokeWidth;
    this.currPath.strokeColor = this.strokeColor;
  }
}
