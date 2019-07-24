import { BaseMouseUtil } from '../util';
import { IHitOption, StoryLine, StoryName } from '../../types';
import paper, { Path } from 'paper';
import { ColorSet } from '../color';

export default class ScaleUtil extends BaseMouseUtil {
  compressInfo: any[][];
  constructor(hitOption: IHitOption, nodes: StoryLine[], names: StoryName[]) {
    super(hitOption, nodes, names);
    this.compressInfo = [];
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (!this.selectPath) {
      super.mouseUp(e);
      if (this.endPosition && this.startPosition) {
        const x0 = this.startPosition.x as number;
        const x1 = this.endPosition.x as number;
        const y0 = this.startPosition.y as number;
        const y1 = this.endPosition.y as number;
        const res = this.storyStore.getStoryLineNameNodeRangeWithRectangle(
          x0,
          y0,
          x1,
          y1
        );
        if (res.length > 0) {
          const deltaY = y1 - y0;
          res.push(deltaY);
          this.compressInfo.push(res);
        }
      }
    }
  }

  drag(e: paper.MouseEvent) {
    if (!this.selectPath) {
      super.mouseDrag(e);
      if (this.startPosition && this.endPosition) {
        this.currPath = new Path.Rectangle(
          this.startPosition,
          this.endPosition
        );
        this.currPath.strokeColor = ColorSet.black;
        this.currPath.strokeWidth = 2;
        this.currPath.fillColor = ColorSet.grey;
        this.currPath.opacity = 0.5;
      }
    }
  }
}