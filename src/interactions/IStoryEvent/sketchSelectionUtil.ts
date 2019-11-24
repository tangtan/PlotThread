import { StoryUtil } from './baseUtil';
import { ColorPicker } from '../../utils/color';
import paper, { Path } from 'paper';

export default class SketchSelectionUtil extends StoryUtil {
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
      return {
        names: this.selectedItems.map(item => item.name),
        timeSpan: [sTime, eTime],
        style: this.utilType,
        param: {}
      };
    }
    return null;
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
}