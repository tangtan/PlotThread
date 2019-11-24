import { StoryUtil } from './baseUtil';
import { ColorPicker } from '../../utils/color';
import paper, { Path } from 'paper';

export default class CircleSelectionUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) {
      super.mouseUp(e);
      return null;
    }
    if (this.currPath && this.currPath.bounds) {
      const bounds = this.currPath.bounds;
      const sPoint = bounds.topLeft;
      const ePoint = bounds.bottomRight;
      if (sPoint && ePoint && this.storyStore) {
        const sTime = this.getStartTime(sPoint);
        const eTime = this.getEndTime(ePoint);
        const names = this.storyStore.names.filter(name =>
          this.isInSelectionRegion(name, sPoint, ePoint)
        );
        super.mouseUp(e);
        return [names, [sTime, eTime]];
      }
    }
    super.mouseUp(e);
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }

  createCurrPath() {
    if (this.currPath) this.currPath.remove();
    this.currPath = new Path({ closed: true });
    if (this._downPoint) this.currPath.add(this._downPoint);
    this.currPath.strokeWidth = 2;
    this.currPath.strokeColor = ColorPicker.black;
  }

  updateCurrPath() {
    if (this.currPath && this._dragPoint) this.currPath.add(this._dragPoint);
  }
}
