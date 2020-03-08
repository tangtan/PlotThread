import { CircleSelectionUtil } from './baseUtil';
import { project, Path, Point } from 'paper';
import { ColorPicker } from '../../utils/color';
import StylishUtil from './stylishUtil';

export default class AttractUtil extends CircleSelectionUtil {
  cnt: number;
  names: string[];
  sTimeID: number;
  eTimeID: number;
  path: Path | null;
  startPoint: Point | null;
  endPoint: Point | null;
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
    this.cnt = 0;
    this.names = [];
    this.sTimeID = -1;
    this.eTimeID = -1;
    this.path = null;
    this.startPoint = null;
    this.endPoint = null;
  }

  updatePath() {
    if (this.startPoint && this.endPoint) {
      if (this.path) this.path.remove();
      this.path = new Path.Line(this.startPoint, this.endPoint);
      this.path.strokeColor = ColorPicker.black;
      this.path.strokeWidth = 2;
    }
  }
  createBounds(point: Point | null) {
    if (!point || !point.x || !point.y) return null;
    let bounds = {
      topLeft: new Point(point.x - 50, point.y - 50),
      middleCenter: point,
      bottomRight: new Point(point.x + 50, point.y + 50)
    };
    return bounds;
  }
  down(e: paper.MouseEvent) {
    if (!(this.cnt & 1)) super.mouseDown(e);
    else {
      this.startPoint = e.point;
    }
  }
  click(e: paper.MouseEvent) {
    if (this.path) {
      this.path.remove();
      this.path = null;
    }
    super.mouseUp(e);
  }
  up(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) {
      super.mouseUp(e);
      return null;
    }
    if (this.cnt & 1) {
      //这个逻辑下面不做完一次操作的话 circle不会消失
      if (this.path) {
        this.path.remove();
        this.path = null;
      }
      const bounds = this.createBounds(e.point);
      if (bounds) {
        const lPoint = bounds.topLeft;
        const rPoint = bounds.bottomRight;
        const sPoint = this.startPoint;
        const ePoint = this.endPoint;
        if (lPoint && rPoint && sPoint && ePoint && this.storyStore) {
          const secSTimeID = this.getStartTimeID(lPoint);
          const secETimeID = this.getEndTimeID(rPoint);
          const secNames = this.storyStore.names.filter(name =>
            this.isInSelectionRegion(name, lPoint, rPoint)
          );
          const type = sPoint.y && ePoint.y ? sPoint.y > ePoint.y : 0; // s > e bottom to top
          super.mouseUp(e);
          this.cnt ^= 1;
          return [
            type,
            [
              [this.names, this.sTimeID, this.eTimeID],
              [secNames, secSTimeID, secETimeID]
            ]
          ];
        }
      }
      super.mouseUp(e);
      this.cnt ^= 1;
      return null;
    } else {
      if (this.currPath && this.currPath.bounds) {
        const bounds = this.currPath.bounds;
        const cPoint = bounds.center;
        const sPoint = bounds.topCenter;
        const ePoint = bounds.bottomCenter;
        const lPoint = bounds.topLeft;
        const rPoint = bounds.bottomRight;
        if (sPoint && ePoint && cPoint && lPoint && rPoint && this.storyStore) {
          this.sTimeID = this.getStartTimeID(lPoint);
          this.eTimeID = this.getEndTimeID(rPoint);
          this.names = this.storyStore.names.filter(name =>
            this.isInSelectionRegion(name, sPoint, ePoint)
          );
          this.cnt ^= 1;
        }
        this.currPath.strokeColor = ColorPicker.blue;
      }
    }
  }

  drag(e: paper.MouseEvent) {
    if (!(this.cnt & 1)) super.mouseDrag(e);
    else {
      this.endPoint = e.point;
      if (this.endPoint) this.updatePath();
    }
  }
}
