import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../color';

export default class StrokeUtil extends StoryUtil {
  divideInfo: any[][];
  status: boolean;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.divideInfo = [];
    this.status = false;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    if (this.selectPath) {
      this.startPosition = e.point;
    }
  }

  up(e: paper.MouseEvent, style: string) {
    if (this.selectPath) {
      super.mouseUp(e);
      const name = this.selectPath.name;
      const startTime = this.getStartTime();
      const endTime = this.getEndTime();
      // console.log(name, startTime, endTime, style);
      if (startTime > -1 && endTime > -1) {
        this.divideInfo.push([name, startTime, endTime, style]);
        this.selectPath.selected = false;
        this.selectPath = null;
      }
      this.status = true;
    } else {
      super.mouseDown(e);
      this.status = false;
    }
    if (this.selectPath) {
      this.selectPath.selected = true;
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      this.selectPath.selected = true;
      super.mouseDrag(e);
      if (this.startPosition && this.endPosition) {
        this.currPath = new Path.Line(
          this.startPosition,
          new Point([this.endPosition.x, this.startPosition.y])
        );
        this.currPath.strokeColor = ColorSet.blue;
        this.currPath.strokeWidth = 2;
      }
    }
  }
}
