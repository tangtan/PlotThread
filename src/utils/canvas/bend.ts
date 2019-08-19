import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../color';

export default class BendUtil extends StoryUtil {
  bendInfo: any[][];
  status: boolean;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.bendInfo = [];
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

  up(e: paper.MouseEvent) {
    if (this.selectPath) {
      super.mouseUp(e);
      const name = this.selectPath.name;
      const startTime = this.getStartTime();
      // const endTime = this.getEndTime();
      console.log(startTime, name);
      if (startTime > -1) {
        this.bendInfo.push([name, startTime]);
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
          new Point([this.startPosition.x, this.endPosition.y])
        );
        this.currPath.strokeColor = ColorSet.blue;
        this.currPath.strokeWidth = 2;
      }
    }
  }
}
