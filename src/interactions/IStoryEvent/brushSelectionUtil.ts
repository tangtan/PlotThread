import { StoryUtil } from './baseUtil';
import { ColorPicker } from '../../utils/color';
import paper, { Path } from 'paper';

export default class BrushSelectionUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    if (this.selectedItems.length !== this.actorNum) return null;
    if (this._downPoint && this._dragPoint) {
      const sTime = this.getStartTime(this._downPoint);
      const eTime = this.getEndTime(this._dragPoint);
      const names = this.selectedItems.map(item => item.name);
      const x1 = this._downPoint.x || 0;
      const y1 = this._downPoint.y || 0;
      const x2 = this._dragPoint.x || 0;
      const y2 = this._dragPoint.y || 0;
      const thresK = 2.5;
      if (y2 - y1 > thresK * (x2 - x1)) {
        return [names, [sTime]]; // Bend
      } else {
        return [names, [sTime, eTime]];
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }

  updateCurrPath() {
    if (this._downPoint && this._dragPoint) {
      if (this.currPath) this.currPath.remove();
      this.currPath = new Path.Line(this._downPoint, this._dragPoint);
      this.currPath.strokeColor = ColorPicker.black;
      this.currPath.strokeWidth = 2;
    }
  }
}
