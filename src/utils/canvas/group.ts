import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../color';

export default class GroupUtil extends StoryUtil {
  groupInfo: any[][];
  strokeWidth: number;
  circleRadius: number;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.groupInfo = [];
    this.strokeWidth = 1;
    this.circleRadius = 1;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    if (this.selectPath) {
      return;
    }
    super.mouseUp(e);
    if (this.endPosition && this.startPosition && this.storyStore) {
      const startX = this.startPosition.x as number;
      const startY = this.startPosition.y as number;
      const startTime = this.storyStore.getStoryTimeSpan(startX, startY)[0];
      const endX = this.endPosition.x as number;
      const endY = this.endPosition.y as number;
      const endTime = this.storyStore.getStoryTimeSpan(endX, endY)[1];
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);
      const name = this.storyStore.graph.names[0];
      const nameY = this.storyStore.getCharacterY(name, startTime);
      console.log(minY, nameY, maxY, name);
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath) {
      return;
    }
    super.mouseDrag(e);
    if (this.startPosition && this.endPosition) {
      const circleX =
        ((this.startPosition.x || 0) + (this.endPosition.x || 0)) / 2;
      const circleY =
        ((this.startPosition.y || 0) + (this.endPosition.y || 0)) / 2;
      this.createPath(circleX, circleY);
      if (this.currPath) {
        const deltaX = (this.endPosition.x || 2) - (this.startPosition.x || 0);
        const deltaY = (this.endPosition.y || 2) - (this.startPosition.y || 0);
        const xScaleFactor = (0.5 * deltaX) / this.circleRadius;
        const yScaleFactor = (0.5 * deltaY) / this.circleRadius;
        this.currPath.scale(xScaleFactor, yScaleFactor);
      }
    }
  }

  createPath(mouseX: number, mouseY: number) {
    const circleR = this.circleRadius;
    const circleX = mouseX + circleR;
    const circleY = mouseY + circleR;
    this.currPath = new Path.Circle(new Point(circleX, circleY), circleR);
    this.currPath.strokeColor = ColorSet.black;
    this.currPath.strokeWidth = this.strokeWidth;
  }
}
