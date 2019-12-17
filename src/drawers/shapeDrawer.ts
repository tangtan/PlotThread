import BaseDrawer from './baseDrawer';
import { Path } from 'paper';

export default class ShapeDrawer extends BaseDrawer {
  defaultRadius: number;
  defaultEllipseA: number;
  defaultEllipseB: number;
  constructor(cfg: any) {
    super(cfg);
    this.defaultRadius = 25;
    this.defaultEllipseA = 30;
    this.defaultEllipseB = 15;
  }

  _drawVisualObjects(
    type: string,
    isCreating: boolean,
    x0: number,
    y0: number
  ) {
    let shape: Path;
    switch (type) {
      case 'circle':
        shape = this._drawCircle(x0, y0);
        break;
      case 'ellipse':
        shape = this._drawEllipse(x0, y0);
        break;
      case 'triangle':
        shape = this._drawRegularPolygon(3, x0, y0);
        break;
      case 'rectangle':
        shape = this._drawRectangle(x0, y0);
        break;
      case 'pentagon':
        shape = this._drawRegularPolygon(5, x0, y0);
        break;
      case 'hexagon':
        shape = this._drawRegularPolygon(6, x0, y0);
        break;
      case 'star':
        shape = this._drawStar(5, x0, y0);
        break;
      default:
        shape = this._drawCircle(x0, y0);
        break;
    }
    shape.fillColor = this.fillColor;
    shape.strokeColor = this.strokeColor;
    shape.strokeWidth = this.strokeWidth;
    return [shape];
  }

  _drawCircle(x0: number, y0: number) {
    return new Path.Circle({
      center: [x0 || this.originPointX, y0 || this.originPointY],
      radius: this.defaultRadius
    });
  }

  _drawEllipse(x0: number, y0: number) {
    return new Path.Ellipse({
      center: [x0 || this.originPointX, y0 || this.originPointY],
      size: [this.defaultEllipseA * 2, this.defaultEllipseB * 2]
    });
  }

  _drawRegularPolygon(sides: number, x0: number, y0: number) {
    return new Path.RegularPolygon({
      center: [x0 || this.originPointX, y0 || this.originPointY],
      radius: this.defaultRadius,
      sides: sides
    });
  }

  _drawRectangle(x0: number, y0: number) {
    return new Path.Rectangle({
      point: [
        (x0 || this.originPointX) - this.defaultEllipseA,
        (y0 || this.originPointY) - this.defaultEllipseB
      ],
      size: [this.defaultEllipseA * 2, this.defaultEllipseB * 2]
    });
  }

  _drawStar(points: number, x0: number, y0: number) {
    return new Path.Star({
      center: [x0 || this.originPointX, y0 || this.originPointY],
      points: points,
      radius1: this.defaultEllipseB,
      radius2: this.defaultEllipseA
    });
  }
}
