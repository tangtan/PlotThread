import { StoryUtil } from './baseUtil';
import { ColorPicker } from '../../utils/color';
import paper, { Path, Point } from 'paper';

export default class ReshapeSelectionUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (!this.currPath) return 1;
    if (!this.storyStore) return 2;
    const currAnchor = this.currPath.firstSegment.point as Point;
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
    // console.log(_xy, upperAnchor, bottomAnchor);
    super.mouseUp(e);
    return [upperPath, bottomPath];
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }

  createCurrPath() {
    if (this.currPath) this.currPath.remove();
    this.currPath = new Path();
    if (this._downPoint) this.currPath.add(this._downPoint);
    this.currPath.strokeWidth = 2;
    this.currPath.strokeColor = ColorPicker.black;
  }

  updateCurrPath() {
    if (this.currPath && this._dragPoint) this.currPath.add(this._dragPoint);
  }

  movePathToAnchor(delta: Point) {
    if (!this.currPath) return null;
    const _copyPath = this.currPath.clone() as Path;
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
}
