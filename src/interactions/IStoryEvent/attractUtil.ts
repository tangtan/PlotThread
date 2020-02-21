import { CircleSelectionUtil } from './baseUtil';

export default class AttractUtil extends CircleSelectionUtil {
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
        const sessions = this.getSessions(sPoint, ePoint);
        const names = this.storyStore.names.filter(name =>
          this.isInSelectionRegion(name, sPoint, ePoint)
        );
        const centerX = cPoint.x as number;
        const centerY = cPoint.y as number;
        //如何把这个centerX和centerY传给addEventPanel组件呢？
        super.mouseUp(e);
        //return [names, [sTime, eTime], centerX, centerY];
        return [names, sessions];
      }
    }
    super.mouseUp(e);
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
}
