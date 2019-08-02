import { BaseMouseUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point, Color } from 'paper';
import { ColorSet } from '../color';

export default class ScaleUtil extends BaseMouseUtil {
  compressInfo: any[][];
  strokeWidth: number;
  strokeColor: Color;
  fillColor: Color;
  opacity: number;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.compressInfo = [];
    this.strokeWidth = 2;
    this.strokeColor = ColorSet.black;
    this.fillColor = ColorSet.grey;
    this.opacity = 0.5;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (this.selectPath) {
      return;
    }
    super.mouseUp(e);
    if (this.endPosition && this.startPosition && this.storyStore) {
      const startX = this.startPosition.x as number;
      const startY = this.startPosition.y as number;
      const startTime = this.storyStore.getStoryTimeSpan(startX, startY)[0];
      const endX = this.endPosition.x as number;
      const endY = this.endPosition.y as number;
      const endTime = this.storyStore.getStoryTimeSpan(endX, endY)[1];
      const deltaY = Math.abs(endY - startY);
      this.compressInfo.push([startTime, endTime, deltaY]);
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      return;
    }
    super.mouseDrag(e);
    if (this.startPosition && this.endPosition) {
      this.createPath(this.startPosition, this.endPosition);
    }
  }

  createPath(sPoint: Point, ePoint: Point) {
    this.currPath = new Path.Rectangle(sPoint, ePoint);
    this.currPath.strokeColor = this.strokeColor;
    this.currPath.strokeWidth = this.strokeWidth;
    this.currPath.fillColor = this.fillColor;
    this.currPath.opacity = this.opacity;
  }
}
