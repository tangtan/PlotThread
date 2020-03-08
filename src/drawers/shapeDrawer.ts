import BaseDrawer from './baseDrawer';
import { Path, Segment, CompoundPath } from 'paper';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';

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
    let shape: Path | CompoundPath;
    switch (type) {
      case 'appear':
        shape = this._drawAppear(x0, y0);
        break;
      case 'end':
        shape = this._drawEnd(x0, y0);
        break;
      case 'spark':
        shape = this._drawSpark(x0, y0);
        break;
      case 'highlight':
        shape = this._drawHighlight(x0, y0);
        break;
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

  _drawAppear(x0: number, y0: number) {
    let paths = [];
    for (let i = 0; i < 8; i++) {
      const outer = [
        x0 + Math.cos((3.14 / 4) * i) * this.defaultEllipseA,
        y0 + Math.sin((3.14 / 4) * i) * this.defaultEllipseA
      ];
      const inner = [
        x0 + Math.cos((3.14 / 4) * i) * this.defaultEllipseB,
        y0 + Math.sin((3.14 / 4) * i) * this.defaultEllipseB
      ];
      const str = `M ${inner[0]} ${inner[1]} L ${outer[0]} ${outer[1]}`;
      paths[i] = new Path(str);
    }
    return new CompoundPath(paths);
  }
  _drawEnd(x0: number, y0: number) {
    const lefStr = `M ${x0 - 5} ${y0 - this.defaultEllipseB} L ${x0 - 5} ${y0 +
      this.defaultEllipseB}`;
    const rigStr = `M ${x0 + 5} ${y0 - this.defaultEllipseA} L ${x0 + 5} ${y0 +
      this.defaultEllipseA}`;
    const lefSeg = new Path(lefStr);
    const rigSeg = new Path(rigStr);
    return new CompoundPath({
      children: [lefSeg, rigSeg]
    });
  }
  _drawHighlight(x0: number, y0: number) {
    let paths = [];
    for (let i = 0; i < 3; i++) {
      const outer = [
        x0 + Math.cos((Math.PI / 3) * i + Math.PI * 0.5) * this.defaultEllipseA,
        y0 + Math.sin((Math.PI / 3) * i + Math.PI * 0.5) * this.defaultEllipseA
      ];
      const inner = [
        x0 + Math.cos((Math.PI / 3) * i + Math.PI * 1.5) * this.defaultEllipseA,
        y0 + Math.sin((Math.PI / 3) * i + Math.PI * 1.5) * this.defaultEllipseA
      ];
      const str = `M ${inner[0]} ${inner[1]} L ${outer[0]} ${outer[1]}`;
      paths[i] = new Path(str);
    }
    return new CompoundPath(paths);
  }
  _drawSpark(x0: number, y0: number) {
    let pathStr = `M ${x0 + this.defaultEllipseA} ${y0}`;
    for (let i = 1; i < 8; i++) {
      if (i & 1) {
        const point = [
          x0 + Math.cos((3.14 / 4) * i) * this.defaultEllipseB,
          y0 + Math.sin((3.14 / 4) * i) * this.defaultEllipseB
        ];
        pathStr += ` L ${point[0]} ${point[1]}`;
      } else {
        const point = [
          x0 + Math.cos((3.14 / 4) * i) * this.defaultEllipseA,
          y0 + Math.sin((3.14 / 4) * i) * this.defaultEllipseA
        ];
        pathStr += ` L ${point[0]} ${point[1]}`;
      }
    }
    pathStr += ` L ${x0 + this.defaultEllipseA} ${y0}`;
    const point = [
      x0 + Math.cos(3.14 / 4) * this.defaultEllipseB,
      y0 + Math.sin(3.14 / 4) * this.defaultEllipseB
    ];
    pathStr += ` L ${point[0]} ${point[1]}`;
    return new Path(pathStr);
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
