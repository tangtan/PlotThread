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
    if (this.selectedItems.length !== this.actorNum) {
      return null;
    }
    if (this._downPoint && this._dragPoint) {
      const sTime = this.getStartTime(this._downPoint);
      const eTime = this.getEndTime(this._dragPoint);
      // TODO: only storylines allowed
      const names = this.selectedItems.map(item => item.name);
      return [names.slice(0, 1), [sTime, eTime]];
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
