import { BaseMouseUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point, project } from 'paper';
import { ColorSet } from '../color';

export default class BendUtil extends BaseMouseUtil {
  straightenInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.straightenInfo = [];
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
    if (!this.selectPath && project && e.point) {
      const hitRes = project.hitTest(e.point, this.hitOption);
      if (hitRes) {
        this.selectPath = hitRes.item;
        if (this.selectPath) {
          this.selectPath.strokeColor = ColorSet.red;
        }
      }
    } else {
      super.mouseUp(e);
      if (
        this.selectPath &&
        this.endPosition &&
        this.startPosition &&
        this.storyStore
      ) {
        const name = this.selectPath.name;
        const startX = this.startPosition.x as number;
        const startY = this.startPosition.y as number;
        const startTime = this.storyStore.getStoryTimeSpan(startX, startY);
        const endX = this.endPosition.x as number;
        const endY = this.endPosition.y as number;
        const endTime = this.storyStore.getStoryTimeSpan(endX, endY);
        this.straightenInfo.push([name, startTime, endTime]);
        this.selectPath.strokeColor = ColorSet.black;
      }
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
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
