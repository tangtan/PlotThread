import { CircleSelectionUtil } from './baseUtil';

export default class CompressUtil extends CircleSelectionUtil {
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
      const cPoint = bounds.center;
      const sPoint = bounds.topCenter;
      const ePoint = bounds.bottomCenter;
      if (sPoint && ePoint && cPoint && this.storyStore) {
        const sTime = this.getStartTime(sPoint);
        const eTime = this.getEndTime(ePoint);
        const names = ['TODO'];
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
}
