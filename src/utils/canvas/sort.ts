import { BaseMouseUtil } from '../util';
import { IHitOption } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../color';

export default class SortUtil extends BaseMouseUtil {
  orderInfo: string[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.orderInfo = [];
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent, nodes: number[][][], names: string[]) {
    if (this.selectPath && e.point) {
      super.mouseUp(e);
      const name = this.selectPath.name as string;
      const x = e.point.x;
      const y = e.point.y;
      if (x && y) {
        const beforeName = super.findStorylineByPosition(nodes, names, x, y);
        if (name !== beforeName) {
          this.orderInfo.push([beforeName, name]);
        }
      }
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      super.mouseDrag(e);
      if (this.startPosition) {
        const path = this.selectPath.clone() as Path;
        path.strokeColor = ColorSet.green;
        if (e.point && this.startPosition) {
          const newY = e.point.y as number;
          const oldY = this.startPosition.y as number;
          const deltaY = newY - oldY;
          const delta = new Point(0, deltaY);
          path.translate(delta);
        }
        this.currPath = path;
      }
    }
  }
}
