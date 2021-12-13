import { CircleSelectionUtil } from './baseUtil';
import { Path, Point } from 'paper';
import { ColorPicker } from '../../utils/color';

export default class Transform extends CircleSelectionUtil {
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
  createPath() {
    if (this.path) this.path.remove();
    this.path = new Path();
    if (this.startPoint) this.path.add(this.startPoint);
    this.path.strokeWidth = 2;
    this.path.strokeColor = ColorPicker.black;
  }
  updatePath() {
    if (this.path && this.endPoint) this.path.add(this.endPoint);
  }
  down(e: paper.MouseEvent) {
    if (!(this.cnt & 1)) super.mouseDown(e);
    else {
      this.startPoint = e.point;
      this.createPath();
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
      if (!this.path) return null;
      if (!this.storyStore) return null;
      const currAnchor = this.path.firstSegment.point as Point;
      const _paths = this.storyStore.graph.paths;
      const _xy = _paths.map((path: any) => path[0][0]);
      _xy.sort((a: any, b: any) => {
        return a[1] - b[1];
      });
      const upperPoint = _xy[0];
      const bottomPoint = _xy[_xy.length - 1];
      const minX = Math.min(upperPoint[0], bottomPoint[0]);
      const upperAnchor = new Point(minX, upperPoint[1]);
      const upperDelta = upperAnchor.subtract(currAnchor);
      const upperPath = this.movePathToAnchor(upperDelta);
      const bottomAnchor = new Point(minX, bottomPoint[1]);
      const bottomDelta = bottomAnchor.subtract(currAnchor);
      const bottomPath = this.movePathToAnchor(bottomDelta);

      super.mouseUp(e);
      this.cnt ^= 1;
      this.path.remove();
      this.path = null;
      return {
        names: this.names,
        timeID: [this.sTimeID, this.eTimeID],
        paths: [upperPath, bottomPath]
      };
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
        this.currPath.closed = true;
      }
    }
  }
  movePathToAnchor(delta: Point) {
    if (!this.path) return null;
    const _copyPath = this.path.clone() as Path;
    _copyPath.translate(delta);
    // debugger;
    const segments = _copyPath.segments || [];
    const points = segments.map(segment => {
      const _point = segment.point;
      return _point ? [_point.x || 0, _point.y || 0] : [0, 0];
    });
    _copyPath.remove();
    return points;
  }
  drag(e: paper.MouseEvent) {
    if (!(this.cnt & 1)) super.mouseDrag(e);
    else {
      this.endPoint = e.point;
      if (this.endPoint) this.updatePath();
    }
  }
}
