import { BrushSelectionUtil } from './baseUtil';

export default class StylishUtil extends BrushSelectionUtil {
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
      const sTime = this.getStartTimeID(this._downPoint);
      const eTime = this.getEndTimeID(this._dragPoint);
      const names = this.selectedItems.map(item => item.name);
      const {
        lTime,
        rTime,
        sSessionID,
        mSessionID,
        eSessionID
      } = this.getSessionBreaks(this._downPoint, this._dragPoint);
      const nameIDs: number[] = [];
      names.forEach((val, id, array) => {
        nameIDs.push(Number(this.getStorylineIDByName(val)));
      });
      const x1 = this._downPoint.x || 0;
      const y1 = this._downPoint.y || 0;
      const x2 = this._dragPoint.x || 0;
      const y2 = this._dragPoint.y || 0;
      const thresK = 2.5;
      if (y2 - y1 > thresK * (x2 - x1)) {
        return [nameIDs, [lTime, rTime, sSessionID, mSessionID, eSessionID]]; // Bend
      } else {
        return [nameIDs, [sTime, eTime]];
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
