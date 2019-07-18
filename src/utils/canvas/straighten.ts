import { BaseMouseUtil } from '../util';
import { IHitOption } from '../../types';
import paper, { Path, Point, project } from 'paper';
import { ColorSet } from '../color';

export default class StraightenUtil extends BaseMouseUtil {
  straightenInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.straightenInfo = [];
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
      if (this.selectPath) {
        const name = this.selectPath.name;
        // TODO
        this.straightenInfo.push([name, 0, 1000]);
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
