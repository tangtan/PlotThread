import { StoryUtil } from '../util';
import { IHitOption, StoryGraph, PathStyleSegment } from '../../types';
import { Path } from 'paper';
import { ColorSet } from '../color';
import StrokeStyle from '../strokestyle';
export default class WidthUtil extends StoryUtil {
  strokeStyle: StrokeStyle | null;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.strokeStyle = null;
  }
  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }
  up(e: paper.MouseEvent) {
    if (this.selectPath && e.point && this.startPosition) {
      super.mouseUp(e);
      const name = this.selectPath.name as string;
      const start_x = this.startPosition.x;
      const end_x = e.point.x;
      if (start_x && end_x) {
        const style = new WidthPathStyleSegment(name, start_x, end_x, 10);
        if (this.strokeStyle) {
          this.strokeStyle.styles.push(style);
        }
      }
    }
  }
  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      super.mouseDrag(e);
      if (
        this.startPosition &&
        this.endPosition &&
        this.endPosition.x &&
        this.startPosition.y
      ) {
        const path = new Path();
        path.strokeColor = ColorSet.blue;
        path.add(this.startPosition);
        path.add([this.endPosition.x, this.startPosition.y]);
        this.currPath = path;
      }
    }
  }
}

class WidthPathStyleSegment extends PathStyleSegment {
  width: number;
  constructor(name: string, left: number, right: number, width: number) {
    super(name, left, right);
    this.width = width;
  }
  public draw = (path: Path) => {
    path.strokeWidth = this.width;
  };
}
