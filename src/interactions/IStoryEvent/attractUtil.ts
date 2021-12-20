import { CircleSelectionUtil } from './baseUtil';

export default class AttractUtil extends CircleSelectionUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
    if (this.currPath) {
    }
  }

  up(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) {
      super.mouseUp(e);
      return null;
    }
    if (this.currPath && this.currPath.bounds) {
      this.currPath.closed = true;
      const bounds = this.currPath.bounds;
      const cPoint = bounds.center;
      const sPoint = bounds.topCenter;
      const ePoint = bounds.bottomCenter;
      const lPoint = bounds.topLeft;
      const rPoint = bounds.bottomRight;
      if (sPoint && ePoint && cPoint && lPoint && rPoint && this.storyStore) {
        super.mouseUp(e);
        const sTime = this.getStartTime(lPoint);
        const eTime = this.getEndTime(rPoint);
        const names = ['TODO'];
        return [names, sTime, eTime];
      }
    }
    super.mouseUp(e);
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
