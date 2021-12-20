import paper, { Path, Point, project } from 'paper';
import { StoryStore } from '../../utils/storyStore';
import { ColorPicker } from '../../utils/color';

class BaseSelectionUtil {
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
      item => item.data.type === 'storyline' && item.selected
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

  get storylines() {
    if (!project) return [];
    if (!project.activeLayer.children) return [];
    return project.activeLayer.children.filter(
      item => item.data.type === 'storyline'
    );
  }

  updateStoryStore(store: StoryStore) {
    this.storyStore = store;
  }

  getStartTime(sPoint: Point) {
    if (!this.storyStore) return -1;
    const startX = sPoint.x as number;
    const startTime = this.storyStore.getStoryTimeSpan(startX)[0];
    return startTime;
  }

  getEndTime(ePoint: Point) {
    if (!this.storyStore) return -1;
    const endX = ePoint.x as number;
    const endTime = this.storyStore.getStoryTimeSpan(endX)[1];
    return endTime;
  }
}

export class SketchSelectionUtil extends StoryUtil {
  /*
   * 自由笔刷工具
   */
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  createCurrPath() {
    if (this.currPath) this.currPath.remove();
    this.currPath = new Path();
    if (this._downPoint) this.currPath.add(this._downPoint);
    this.currPath.strokeWidth = 2;
    this.currPath.strokeColor = ColorPicker.black;
  }

  updateCurrPath() {
    if (this.currPath && this._dragPoint) this.currPath.add(this._dragPoint);
  }
}

export class BrushSelectionUtil extends StoryUtil {
  /*
   * 直线笔刷工具
   */
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  updateCurrPath() {
    if (this._downPoint && this._dragPoint) {
      if (this.currPath) this.currPath.remove();
      this.currPath = new Path.Line(this._downPoint, this._dragPoint);
      this.currPath.strokeColor = ColorPicker.black;
      this.currPath.strokeWidth = 2;
    }
  }
}

export class CircleSelectionUtil extends StoryUtil {
  /*
   * 自由选框工具
   */
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  createCurrPath() {
    if (this.currPath) this.currPath.remove();
    this.currPath = new Path({ closed: true });
    if (this._downPoint) this.currPath.add(this._downPoint);
    this.currPath.strokeWidth = 2;
    this.currPath.strokeColor = ColorPicker.black;
    this.currPath.dashOffset = 0;
    this.currPath.dashArray = [10, 10];
    this.currPath.closed = false;
  }

  updateCurrPath() {
    if (this.currPath && this._dragPoint) this.currPath.add(this._dragPoint);
  }
}

export class RectSelectionUtil extends StoryUtil {
  /*
   * TODO: 矩形选框工具
   */
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }
}
