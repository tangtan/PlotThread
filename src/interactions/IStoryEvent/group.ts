import { StoryUtil } from './util';
import { IHitOption, StoryGraph } from '../../types';
import paper, { Path, Point } from 'paper';
import { ColorSet } from '../../utils/color';

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
    if (this.storyStore) {
      const sTime = this.getStartTime();
      const eTime = this.getEndTime();
      if (sTime > -1 && eTime > -1) {
        const charArr = this.storyStore.names.filter(name =>
          this.isInSelectionRegion(name, sTime, eTime)
        );
        console.log(charArr, sTime, eTime);
      }
    }
  }

  isInSelectionRegion(name: string, sTime: number, eTime: number) {
    let flag = false;
    if (sTime < 0) {
      return flag;
    }
    if (eTime < 0) {
      return flag;
    }
    if (this.endPosition && this.startPosition && this.storyStore) {
      const startY = this.startPosition.y as number;
      const endY = this.endPosition.y as number;
      const storyStore = this.storyStore;
      const sTmpY = storyStore.getCharacterY(name, sTime);
      const eTmpY = storyStore.getCharacterY(name, eTime);
      // console.log(name, sTmpY, eTmpY, startY, endY);
      if ((sTmpY - startY) * (sTmpY - endY) < 0) {
        flag = true;
      }
      if ((eTmpY - startY) * (eTmpY - endY) < 0) {
        flag = true;
      }
    }
    return flag;
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
      this.createCurrPath(circleX, circleY);
      if (this.currPath) {
        const deltaX = (this.endPosition.x || 2) - (this.startPosition.x || 0);
        const deltaY = (this.endPosition.y || 2) - (this.startPosition.y || 0);
        const xScaleFactor = (0.5 * deltaX) / this.circleRadius;
        const yScaleFactor = (0.5 * deltaY) / this.circleRadius;
        this.currPath.scale(xScaleFactor, yScaleFactor);
      }
    }
  }

  createCurrPath(mouseX: number, mouseY: number) {
    const circleR = this.circleRadius;
    const circleX = mouseX + circleR;
    const circleY = mouseY + circleR;
    this.currPath = new Path.Circle(new Point(circleX, circleY), circleR);
    this.currPath.strokeColor = ColorSet.black;
    this.currPath.strokeWidth = this.strokeWidth;
  }
}
