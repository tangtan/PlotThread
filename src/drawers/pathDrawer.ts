import BaseDrawer from './baseDrawer';
import { Path } from 'paper';

export default class PathDrawer extends BaseDrawer {
  constructor(cfg: any) {
    super(cfg);
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    const _x0 = x0 || this.originPointX;
    const _y0 = y0 || this.originPointY;
    const _x1 = _x0 + 200;
    return [
      new Path({
        segments: isCreating ? [] : [[_x0, _y0], [_x1, _y0]],
        strokeColor: isCreating ? this.creatingColor : this.strokeColor,
        strokeWidth: this.strokeWidth,
        closed: false,
        data: { isCreating: isCreating }
      })
    ];
  }
}
