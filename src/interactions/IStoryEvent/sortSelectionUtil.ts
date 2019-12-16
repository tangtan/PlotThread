import { StoryUtil } from './baseUtil';
import { ColorPicker } from '../../utils/color';
import paper, { Group, CompoundPath } from 'paper';

export default class SortSelectionUtil extends StoryUtil {
  constructor(type: string, actorNum: number) {
    super(type, actorNum);
  }

  down(e: paper.MouseEvent) {
    super.mouseDown(e);
  }

  up(e: paper.MouseEvent) {
    super.mouseUp(e);
    const order = this.getOrderOfStorylines();
    const time = [0, 10000];
    for (let i = 0, len = order.length; i < len; i++) {
      const { name, oldY, newY } = order[i];
      // console.log(name, oldY, newY);
      if (newY - oldY > 1) {
        const upName = order[i - 1].name;
        return [[upName, name], time];
      } else if (newY - oldY < -1) {
        const downName = order[i + 1].name;
        return [[name, downName], time];
      }
    }
    return null;
  }

  drag(e: paper.MouseEvent) {
    super.mouseDrag(e);
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
    const compoundPath = _line.lastChild as CompoundPath;
    const firstSegment = compoundPath.firstSegment;
    if (!firstSegment.point) return 0;
    return firstSegment.point.y || 0;
  }
}
