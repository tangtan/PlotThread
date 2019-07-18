import { BaseMouseUtil } from '../util';
import { IHitOption } from '../../types';
import paper, { Path } from 'paper';
import { ColorSet } from '../color';

export default class CompressUtil extends BaseMouseUtil {
  compressInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.compressInfo = [];
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (!this.selectPath) {
      super.mouseUp(e);
    }
  }

  drag(e: paper.MouseEvent) {
    if (!this.selectPath) {
      super.mouseDrag(e);
      if (this.startPosition && this.endPosition) {
        this.currPath = new Path.Rectangle(
          this.startPosition,
          this.endPosition
        );
        this.currPath.strokeColor = ColorSet.black;
        this.currPath.strokeWidth = 2;
        this.currPath.fillColor = ColorSet.grey;
        this.currPath.opacity = 0.5;
      }
    }
  }
}
