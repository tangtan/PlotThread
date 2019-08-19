import { StoryUtil, DoubleSelectUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import { Path } from 'paper';
import { BLUE } from '../color';
export default class KnotUtil extends StoryUtil {
  select: DoubleSelectUtil;
  knotInfo: any[][];
  status: boolean;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.select = new DoubleSelectUtil(hitOption);
    this.knotInfo = [];
    this.status = false;
  }
  down(e: paper.MouseEvent) {
    if (this.select.status()) {
      super.mouseDown(e);
    }
  }
  drag(e: paper.MouseEvent) {
    if (this.select.status()) {
      super.mouseDrag(e);
      if (
        this.startPosition &&
        this.endPosition &&
        this.endPosition.x &&
        this.startPosition.y
      ) {
        this.currPath = new Path();
        this.currPath.strokeColor = BLUE;
        this.currPath.add(this.startPosition);
        this.currPath.add([this.endPosition.x, this.startPosition.y]);
      }
    }
  }
  up(e: paper.MouseEvent) {
    if (this.select.status()) {
      super.mouseUp(e);
      if (
        this.select.selectPath &&
        this.select.secondSelectPath &&
        this.startPosition &&
        this.endPosition
      ) {
        const start = this.getStartTime();
        const end = this.getEndTime();
        const first_name = this.select.selectPath.name;
        const second_name = this.select.secondSelectPath.name;
        console.log(first_name, second_name, start, end);
        if (start && end && first_name && second_name) {
          const names = [first_name, second_name];
          this.knotInfo.push([names, start, end, 'Knot']);
        }
        this.select.restore();
        this.status = true;
      }
    } else {
      this.select.up(e);
      this.status = false;
    }
  }
}
