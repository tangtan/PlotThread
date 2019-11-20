import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../../utils/color';

export default class StraightenUtil extends StoryUtil {
  straightenInfo: any[][];
  status: boolean;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.straightenInfo = [];
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
      const endTime = this.getEndTime();
      if (startTime > -1 && endTime > -1) {
        this.straightenInfo.push([name, startTime, endTime]);
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
