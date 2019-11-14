import BaseDrawer from './baseDrawer';
import { Raster } from 'paper';

export default class ImageDrawer extends BaseDrawer {
  constructor(cfg: any) {
    super(cfg);
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0?: number,
    y0?: number
  ) {
    const image = this._drawRaster(type);
    return [image];
  }

  _drawRaster(type: string) {
    return new Raster(type);
  }
}
