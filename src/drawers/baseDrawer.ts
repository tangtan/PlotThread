import { Group, Color } from 'paper';
import { ColorPicker } from '../utils/color';
import { Coord } from '../utils/coord';

export default class BaseDrawer {
  fillColor: Color;
  creatingColor: Color;
  strokeColor: Color;
  strokeWidth: number;
  shadowColor: Color;
  shadowBlur: number;
  shadowOffset: Color;
  originPointX: number;
  originPointY: number;
  constructor(cfg: any) {
    this.fillColor = cfg.fillColor || ColorPicker.grey;
    this.creatingColor = cfg.creatingColor || ColorPicker.blue;
    this.strokeColor = cfg.strokeColor || ColorPicker.black;
    this.strokeWidth = cfg.strokeWidth || 1;
    this.shadowColor = cfg.shadowColor || ColorPicker.black;
    this.shadowBlur = cfg.shadowBlur || 0;
    this.shadowOffset = cfg.shadowOffset || Coord.origin;
    this.originPointX = cfg.originPointX || Coord.center.x;
    this.originPointY = cfg.originPointY || Coord.center.y;
  }

  draw(type: string, isCreating = false, x0?: number, y0?: number) {
    const visualObjects = this._drawVisualObjects(type, isCreating, x0, y0);
    const compoundGroup = new Group(visualObjects);
    compoundGroup.on('mouseenter', () => {
      compoundGroup.selected = true;
    });
    compoundGroup.on('mouseleave', () => {
      // compoundGroup.selected = false;
    });
    compoundGroup.on('mousedrag', (e: any) => {
      if (!isCreating) {
        compoundGroup.translate(e.delta);
      }
    });
    return compoundGroup;
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0?: number,
    y0?: number
  ) {
    return [] as any[];
  }
}
