import paper, { Path, Point, project } from 'paper';
import { StoryGraph } from '../../types';
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

  updateStoryStore(graph: StoryGraph) {
    this.storyStore = new StoryStore(graph);
  }

  getStartTime(sPoint: Point) {
    if (!this.storyStore) return -1;
    const startX = sPoint.x as number;
    const startY = sPoint.y as number;
    const startTime = this.storyStore.getStoryTimeSpan(startX, startY);
    const startTimeID = this.storyStore.getStoryTimeSpanID(
      startTime[0],
      startTime[1]
    )[0];
    return startTimeID;
  }

  getEndTime(ePoint: Point) {
    if (!this.storyStore) return -1;
    const endX = ePoint.x as number;
    const endY = ePoint.y as number;
    const endTime = this.storyStore.getStoryTimeSpan(endX, endY);
    const endTimeID = this.storyStore.getStoryTimeSpanID(
      endTime[0],
      endTime[1]
    )[1];
    return endTimeID;
  }

  getSessions(sPoint: Point, ePoint: Point) {
    if (!this.storyStore) return [-1];
    const startX = sPoint.x as number;
    const startY = sPoint.y as number;
    const endX = ePoint.x as number;
    const endY = ePoint.y as number;
    let sessions = [];
    let sSession = this.storyStore.getSessionID(startX, startY);
    let rSession = this.storyStore.getSessionID(endX, endY);
    if (sSession !== rSession) {
      let mSession = sSession;
      let rate = 50;
      for (let i = 1; i < rate; i++) {
        mSession = this.storyStore.getSessionID(
          startX,
          startY + ((endY - startY) / rate) * i
        );
        if (mSession !== sSession) {
          rSession = mSession;
          break;
        }
      }
    }
    // if(sSession !== rSession){
    //   let mSession = -1;
    //   let rate = 100;
    //   let l = 1,r = rate - 1;
    //   let ansSession = sSession;
    //   while(l <= r){
    //     let mid = (l + r) >> 1;
    //     let tmpSession = this.storyStore.getSessionID(startX,startY + (endY - startY) / rate * mid);
    //     if(tmpSession === sSession){
    //       l = mid + 1;
    //     }
    //     else{
    //       r = mid - 1;
    //       ansSession = tmpSession;
    //     }
    //   }
    //   rSession = ansSession;
    // }
    if (sSession !== -1) sessions.push(sSession);
    if (rSession !== -1 && rSession !== sSession) sessions.push(rSession);
    return sessions;
  }

  getSessionBreaks(sPoint: Point, ePoint: Point) {
    if (!this.storyStore) return { lsSessionID: -1, leSessionID: -1 };
    const startX = sPoint.x as number;
    const startY = sPoint.y as number;
    const endX = ePoint.x as number;
    const endY = ePoint.y as number;
    const mSessionID = this.storyStore.getSessionID(
      (startX + endX) / 2,
      (startY + endY) / 2
    );
    const { lTime, sSessionID } = this.storyStore.getPrevSessionID(mSessionID);
    const { rTime, eSessionID } = this.storyStore.getNextSessionID(mSessionID);
    return { lTime, rTime, sSessionID, mSessionID, eSessionID };
  }

  getStorylineIDByName(name: string | null) {
    if (!this.storyStore) return -1;
    if (!name) return -1;
    const ret = this.storyStore.getStorylineIDByName(name);
    return ret ? (ret as number) : -1;
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
