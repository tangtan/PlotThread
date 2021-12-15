import { BrushSelectionUtil } from './baseUtil';

export default class BendUtil extends BrushSelectionUtil {
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
      // TODO: only storylines allowed
      const names = this.selectedItems.map(item => item.name);
      const x1 = this._downPoint.x || 0;
      const y1 = this._downPoint.y || 0;
      const x2 = this._dragPoint.x || 0;
      const y2 = this._dragPoint.y || 0;
      const thresK = 2.5;
      if (y2 - y1 > thresK * (x2 - x1)) {
        // Bend
        return [names.slice(0, 1), [sTime]];
      } else {
        // Straighten
        return [names.slice(0, 1), [sTime, eTime]];
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
