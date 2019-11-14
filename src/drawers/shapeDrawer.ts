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
        shape = this._drawCircle();
        break;
      case 'ellipse':
        shape = this._drawEllipse();
        break;
      case 'triangle':
        shape = this._drawRegularPolygon(3);
        break;
      case 'rectangle':
        shape = this._drawRectangle();
        break;
      case 'pentagon':
        shape = this._drawRegularPolygon(5);
        break;
      case 'hexagon':
        shape = this._drawRegularPolygon(6);
        break;
      case 'star':
        shape = this._drawStar(5);
        break;
      default:
        shape = this._drawCircle();
        break;
    }
    shape.fillColor = this.fillColor;
    shape.strokeColor = this.strokeColor;
    shape.strokeWidth = this.strokeWidth;
    return [shape];
  }

  _drawCircle() {
    return new Path.Circle({
      center: [this.originPointX, this.originPointY],
      radius: this.defaultRadius
    });
  }

  _drawEllipse() {
    return new Path.Ellipse({
      center: [this.originPointX, this.originPointX],
      size: [this.defaultEllipseA * 2, this.defaultEllipseB * 2]
    });
  }

  _drawRegularPolygon(sides: number) {
    return new Path.RegularPolygon({
      center: [this.originPointX, this.originPointY],
      radius: this.defaultRadius,
      sides: sides
    });
  }

  _drawRectangle() {
    return new Path.Rectangle({
      point: [
        this.originPointX - this.defaultEllipseA,
        this.originPointY - this.defaultEllipseB
      ],
      size: [this.defaultEllipseA * 2, this.defaultEllipseB * 2]
    });
  }

  _drawStar(points: number) {
    return new Path.Star({
      center: [this.originPointX, this.originPointY],
      points: points,
      radius1: this.defaultEllipseB,
      radius2: this.defaultEllipseA
    });
  }
}
