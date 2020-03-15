import { StoryUtil } from './baseUtil';
import paper, { Group, CompoundPath, project, Point, Path } from 'paper';

export default class SortUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    const item = project ? project.hitTest(e.point as Point) : null;
    console.log(item);
    if (item) {
      if (item.type === 'stroke') {
        //region
        if (this._downPoint) {
          if (this.storyStore) {
            const timespan = this.storyStore.getStoryTimeSpan(
              this._downPoint.x as number,
              this._downPoint.y as number
            );
            const timespanID = this.storyStore.getStoryTimeSpanID(
              timespan[0],
              timespan[1]
            );
            const names = this.storyStore.graph.names;

            let order = this.getRegionOrders(names, timespan);
            return [timespanID[0], order];
          }
        }
      } else {
        const order = this.getOrderOfStorylines();
        const time = [0, 10000];
        for (let i = 0, len = order.length; i < len; i++) {
          const { name, oldY, newY } = order[i];
          // console.log(name, oldY, newY);
          const ID = this.getStorylineIDByName(name);
          if (newY - oldY > 1) {
            const upName = order[i - 1].name;
            const upID = this.getStorylineIDByName(upName);
            return [[upID, ID], time];
          } else if (newY - oldY < -1) {
            const downName = order[i + 1].name;
            const downID = this.getStorylineIDByName(downName);
            return [[ID, downID], time];
          }
        }
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
  }
  getRegionOrders(names: any[], timespan: number[]) {
    if (!this.storyStore) return [];
    let totY = [];
    let order = [];
    for (let i = 0; i < names.length - 1; i++) {
      //-1是因为rabbit
      totY[i] = -1;
      let id = this.storyStore.getStorySegmentIDByTime(i, timespan);
      if (id !== -1) {
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
    }
    for (let i = 0; i < names.length - 1; i++) {
      if (totY[i] !== -1) {
        order[i] = 1;
        for (let j = 0; j < names.length - 1; j++) {
          if (i !== j && totY[j] !== -1 && totY[j] < totY[i]) {
            order[i]++;
          }
        }
      } else {
        order[i] = -1;
      }
    }
    return order;
  }
  getOrderOfStorylines() {
    if (!this.storyStore) return [];
    if (!this.storyStore.graph) return [];
    const _names = this.storyStore.graph.names;
    const _paths = this.storyStore.graph.paths;
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
