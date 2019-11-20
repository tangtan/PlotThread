import BaseDrawer from './baseDrawer';
import { PointText } from 'paper';

export default class TextDrawer extends BaseDrawer {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  justification: string;
  defaultContent: string;
  constructor(cfg: any) {
    super(cfg);
    this.fontWeight = cfg.fontWeight || 'normal';
    this.fontSize = cfg.fontSize || 12;
    this.fontFamily = cfg.fontFamily || 'sans-serif';
    this.justification = cfg.justification || 'right';
    this.defaultContent = cfg.defaultContent || 'iStoryline1';
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    const _x0 = x0 || this.originPointX;
    const _y0 = y0 || this.originPointY;
    return [
      new PointText({
        point: [_x0, _y0],
        content: isCreating ? '' : this.defaultContent,
        fillColor: this.fillColor,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
        fontSize: this.fontSize,
        justification: this.justification
      })
    ];
  }
}
