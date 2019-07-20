import { BaseMouseUtil } from '../util';
import { IHitOption, StoryLine, StoryName } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../color';

export default class SortUtil extends BaseMouseUtil {
  orderInfo: string[][];
  constructor(hitOption: IHitOption, nodes: StoryLine[], names: StoryName[]) {
    super(hitOption, nodes, names);
    this.orderInfo = [];
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (this.selectPath && e.point) {
      super.mouseUp(e);
      const name = this.selectPath.name as string;
      const x = e.point.x;
      const y = e.point.y;
      if (x && y) {
        const beforeName = this.storyStore.getStoryLineNameByPosition(x, y);
        if (beforeName && name !== beforeName) {
          this.orderInfo.push([beforeName, name]);
        }
      }
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      super.mouseDrag(e);
      if (this.startPosition) {
        const path = this.selectPath.clone() as Path;
        path.strokeColor = ColorSet.green;
        if (e.point && this.startPosition) {
          const newY = e.point.y as number;
          const oldY = this.startPosition.y as number;
          const deltaY = newY - oldY;
          const delta = new Point(0, deltaY);
          path.translate(delta);
        }
        this.currPath = path;
      }
    }
  }
}
