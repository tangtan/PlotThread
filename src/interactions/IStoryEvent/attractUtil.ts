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
        const sTimeID = this.getStartTimeID(lPoint);
        const eTimeID = this.getEndTimeID(rPoint);
        const names = this.storyStore.names.filter(name =>
          this.isInSelectionRegion(name, sPoint, ePoint)
        );
        super.mouseUp(e);
        return [names, sTimeID, eTimeID];
      }
    }
    super.mouseUp(e);
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
