import { Group, Point, Rectangle } from 'paper';
import BaseMouseEvent from './baseEvent';

export default class MoveEvent extends BaseMouseEvent {
  // visualObjBounds: Rectangle | null;
  defaultPoint: Point;
  downPoint: Point;
  translatePoint: Point;
  constructor(visualObj: Group) {
    super(visualObj);
    // this.visualObjBounds = this.visualObj.internalBounds;
    this.downPoint = new Point(0, 0);
    this.defaultPoint = new Point(0, 0);
    this.translatePoint = new Point(0, 0);
  }

  down(e: any) {
    super.down(e);
    this.downPoint = e.point || this.defaultPoint;
  }

  drag(e: any) {
    super.drag(e);
    if (this.isCreating) return;
    if (this.isTransforming) return;
    this.isSelected = true;
    this.visualObj.translate(e.delta);
    this.visualObj.data.selectionBounds.translate(e.delta);
    this.translatePoint.add(e.delta);
  }
}
