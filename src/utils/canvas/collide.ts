import { StoryUtil, DoubleSelectUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
export default class CollideUtil extends StoryUtil {
  select: DoubleSelectUtil;
  collideInfo: [string, string, number][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.select = new DoubleSelectUtil(hitOption);
    this.collideInfo = [];
  }
  up(e: paper.MouseEvent) {
    if (this.select.status()) {
      if (this.select.selectPath && this.select.secondSelectPath && e.point) {
        const first_name = this.select.selectPath.name;
        const second_name = this.select.secondSelectPath.name;
        const x = e.point.x;
        if (first_name && second_name && x) {
          this.collideInfo.push([first_name, second_name, x]);
        }
        this.select.restore();
      }
    } else {
      this.select.up(e);
    }
  }
}
