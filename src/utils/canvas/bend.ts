import { StoryUtil, DoubleSelectUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import { Path } from 'paper';
import { BLUE } from '../color';
export default class BendUtil extends StoryUtil {
  bendInfo: [string, number][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.bendInfo = [];
  }
  down(e: paper.MouseEvent) {}
  drag(e: paper.MouseEvent) {}
  up(e: paper.MouseEvent) {
    if (this.selectPath) {
      if (e.point && e.point.x && this.selectPath.name) {
        this.bendInfo.push([this.selectPath.name, e.point.x]);
        this.selectPath.selected = false;
        this.selectPath = null;
      }
    } else {
      super.mouseDown(e);
    }
    if (this.selectPath) {
      this.selectPath.selected = true;
    }
  }
}
