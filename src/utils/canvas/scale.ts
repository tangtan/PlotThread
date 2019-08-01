import { BaseMouseUtil } from '../util';
import { IHitOption, StorySegment, StoryName, StoryGraph } from '../../types';
import paper, { Path } from 'paper';
import { ColorSet } from '../color';

export default class ScaleUtil extends BaseMouseUtil {
  compressInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.compressInfo = [];
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (!this.selectPath) {
      super.mouseUp(e);
      if (this.endPosition && this.startPosition && this.storyStore) {
        const startX = this.startPosition.x as number;
        const startY = this.startPosition.y as number;
        const startTime = this.storyStore.getStoryTimeSpan(startX, startY);
        const endX = this.endPosition.x as number;
        const endY = this.endPosition.y as number;
        const endTime = this.storyStore.getStoryTimeSpan(endX, endY);
        const deltaY = Math.abs(endY - startY);
        this.compressInfo.push([startTime, endTime, deltaY]);
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
