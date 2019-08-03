import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point, Color } from 'paper';
import { ColorSet } from '../color';

export default class ScaleUtil extends StoryUtil {
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
    if (this.endPosition && this.startPosition) {
      const startY = this.startPosition.y as number;
      const endY = this.endPosition.y as number;
      const deltaY = Math.abs(endY - startY);
      const startTime = this.getStartTime();
      const endTime = this.getEndTime();
      if (startTime > -1 && endTime > -1) {
        this.compressInfo.push([startTime, endTime, deltaY]);
      }
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
