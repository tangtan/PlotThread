import { Group, Point, Rectangle } from 'paper';
import BaseMouseEvent from './baseEvent';

export default class MoveEvent extends BaseMouseEvent {
  downPoint: Point;
  defaultPoint: Point;
  translatePoint: Point;
  initialVisualObjBounds: Rectangle; // 记录 Visual Object 的初始 internalBounds
  constructor(visualObj: Group) {
    super(visualObj);
    this.downPoint = new Point(0, 0);
    this.defaultPoint = new Point(0, 0);
    this.translatePoint = new Point(0, 0); // 记录 Visual Object 变换后相对初始位置的位移
    this.initialVisualObjBounds = this.visualObj.internalBounds as Rectangle;
  }

  get initialVisualObjBoundsWidth() {
    return this.initialVisualObjBounds.width || 1;
  }

  get initialVisualObjBoundsHeight() {
    return this.initialVisualObjBounds.height || 1;
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
    // 平移 Visual Object 及其 selectionBounds
    this.visualObj.translate(e.delta);
    this.visualObj.data.selectionBounds.translate(e.delta);
  }
}
