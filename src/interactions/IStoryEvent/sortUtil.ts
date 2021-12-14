import { StoryUtil } from './baseUtil';
import paper, { Group, project, Point, Path } from 'paper';

export default class SortUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    if (this.storyStore === null) return null;
    const item = project ? project.hitTest(e.point as Point) : null;
    if (item === null) return null;
    if (item.type === 'stroke') {
      // Move storyline segment
      if (this._downPoint) {
        const timeSpan = this.storyStore.getStoryTimeSpan(
          this._downPoint.x as number
        );
        let order = this.getRegionOrder(timeSpan);
        return [order, timeSpan];
      }
    } else {
      // Move the whole storyline
      const order = this.getStorylinesOrder();
      const time = [
        this.storyStore.getStoryStartTime(),
        this.storyStore.getStoryEndTime()
      ];
      for (let i = 0, len = order.length; i < len; i++) {
        const { name, oldY, newY } = order[i];
        const ID = this.getStorylineIDByName(name);
        if (newY - oldY > 1) {
          const upName = order[i - 1].name;
          // const upID = this.getStorylineIDByName(upName);
          return [[upName, name], time];
        } else if (newY - oldY < -1) {
          const downName = order[i + 1].name;
          // const downID = this.getStorylineIDByName(downName);
          return [[name, downName], time];
        }
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }

  getPosYByTimeSpan(timeSpan: number[]) {
    if (this.storyStore === null) return [];
    const names = this.storyStore.names as string[];
    let totY = [];
    for (let i = 0; i < names.length; i++) {
      totY[i] = -1;
      let id = this.storyStore.getStorySegmentIDByTime(i, timeSpan);
      const compoundPath = this.storylines[i].children;
      if (compoundPath) {
        const stroke = compoundPath.slice(1);
        if (stroke && stroke.length > id) {
          const path = stroke[id] as Path;
          totY[i] = path.firstSegment.next.point
            ? (path.firstSegment.next.point.y as number)
            : -1;
        }
      }
    }
    return totY;
  }

  getRegionOrder(timeSpan: number[]) {
    if (this.storyStore === null) return [];
    const names = this.storyStore.names as string[];
    const totY = this.getPosYByTimeSpan(timeSpan);
    let order = [];
    for (let i = 0; i < names.length; i++) {
      if (totY[i] !== -1) {
        order[i] = 1;
        for (let j = 0; j < names.length; j++) {
          if (i !== j && totY[j] !== -1 && totY[j] < totY[i]) {
            order[i]++;
          }
        }
      } else {
        order[i] = -1;
      }
    }
    console.log(order, totY);
    return order;
  }

  getStorylinesOrder() {
    if (!this.storyStore) return [];
    if (!this.storyStore.graph) return [];
    const _names = this.storyStore.names;
    const _paths = this.storyStore.paths;
    const _ys = _paths.map((_path: any) => this.getPathYFromGraph(_path));
    const _newYs = this.storylines.map((_line: any) =>
      this.getPathYFromCanvas(_line)
    );
    const _arr = _names.map((_name: string, i: number) => {
      return { name: _name, oldY: _ys[i], newY: _newYs[i] };
    });
    _arr.sort((a: any, b: any) => {
      return a.newY - b.newY;
    });
    return _arr;
  }

  getPathYFromGraph(_path: any) {
    return _path[0][0][1];
  }

  getPathYFromCanvas(_line: Group) {
    if (_line.children) {
      const compoundPath = _line.children.slice(1);
      const firstPath = compoundPath[0] as Path;
      if (!firstPath || !firstPath.firstSegment) return 0;
      const firstSegment = firstPath.firstSegment;
      if (!firstSegment.point) return 0;
      return firstSegment.point.y || 0;
    }
    return 0;
  }
}
