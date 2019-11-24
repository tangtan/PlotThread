import paper, { Path, Point, project } from 'paper';
import { StoryGraph } from '../../types';
import { StoryStore } from './storyStore';

export class BaseSelectionUtil {
  utilType: string;
  actorNum: number;
  _downPoint: Point | null;
  _dragPoint: Point | null; // drag & up mouse point
  currPath: Path | null;
  constructor(type: string, actorNum: number) {
    this._downPoint = null;
    this._dragPoint = null;
    this.currPath = null;
    this.utilType = type;
    this.actorNum = actorNum;
  }

  get selectedItems() {
    if (!project) return [];
    if (!project.activeLayer.children) return [];
    return project.activeLayer.children.filter(
      item => item.data.type === 'storyline' && item.data.isTransforming
    );
  }

  mouseUp(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) return;
    this._dragPoint = e.point;
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  mouseDown(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) return;
    this._downPoint = e.point;
    if (this._downPoint) this.createCurrPath();
  }

  mouseDrag(e: paper.MouseEvent) {
    if (this.selectedItems.length !== this.actorNum) return;
    this._dragPoint = e.point;
    if (this._dragPoint) this.updateCurrPath();
  }

  createCurrPath() {}

  updateCurrPath() {}
}

export class StoryUtil extends BaseSelectionUtil {
  storyStore: StoryStore | null;
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
    this.storyStore = null;
  }

  updateStoryStore(graph: StoryGraph) {
    this.storyStore = new StoryStore(graph);
  }

  getStartTime(sPoint: Point) {
    if (!this.storyStore) return -1;
    const startX = sPoint.x as number;
    const startY = sPoint.y as number;
    const startTime = this.storyStore.getStoryTimeSpan(startX, startY)[0];
    return startTime;
  }

  getEndTime(ePoint: Point) {
    if (!this.storyStore) return -1;
    const endX = ePoint.x as number;
    const endY = ePoint.y as number;
    const endTime = this.storyStore.getStoryTimeSpan(endX, endY)[1];
    return endTime;
  }

  isInSelectionRegion(name: string, sPoint: Point, ePoint: Point) {
    let flag = false;
    const sTime = this.getStartTime(sPoint);
    const eTime = this.getEndTime(ePoint);
    if (sTime < 0) {
      return flag;
    }
    if (eTime < 0) {
      return flag;
    }
    if (this.storyStore) {
      const startY = sPoint.y as number;
      const endY = ePoint.y as number;
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
}
