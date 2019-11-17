import { Group, Color, Point, Path, Shape, Rectangle } from 'paper';
import { ColorPicker } from '../utils/color';
import { Coord } from '../utils/coord';
import ScaleEvent from './event/scaleEvent';

const hitShapeOption = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

const defaultPoint = new Point(0, 0);
const anchorPointSize = 6;

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
    const compoundGroup = new Group({
      children: visualObjects,
      data: {
        isCreating: isCreating,
        isTransforming: false,
        isDragging: false
      }
    });
    compoundGroup.data.selectionBounds = this.createSelectionBounds(
      compoundGroup
    );
    const moveUtil = new ScaleEvent(compoundGroup);
    compoundGroup.onMouseEnter = (e: any) => {
      moveUtil.enter(e);
    };
    compoundGroup.onMouseLeave = (e: any) => {
      moveUtil.leave(e);
    };
    compoundGroup.onMouseDown = (e: any) => {
      moveUtil.down(e);
    };
    compoundGroup.onMouseMove = (e: any) => {
      moveUtil.move(e);
    };
    compoundGroup.onMouseUp = (e: any) => {
      moveUtil.up(e);
    };
    compoundGroup.onMouseDrag = (e: any) => {
      moveUtil.drag(e);
    };
    compoundGroup.onClick = (e: any) => {
      moveUtil.click(e);
    };
    return compoundGroup;
  }

  createSelectionBounds(visualObj: Group) {
    const rotateItems = this.createRotatePoint(visualObj);
    const anchorPoints = this.createAnchorPoints(visualObj);
    const selectionBounds = new Group([...rotateItems, ...anchorPoints]);
    selectionBounds.visible = false;
    return selectionBounds;
  }

  createRotatePoint(visualObj: Group) {
    const visualObjBounds = visualObj.internalBounds;
    if (visualObjBounds) {
      const topCenter = visualObjBounds.topCenter || defaultPoint;
      const radius = anchorPointSize / 2;
      const rotation = 0;
      const distance = 20;
      const degree = (Math.PI * (270 + rotation)) / 180;
      const ty = distance * Math.sin(degree);
      const tx = distance * Math.cos(degree);
      const point = topCenter.subtract(new Point(tx, -ty));
      const line = new Path.Line(topCenter, point);
      line.strokeColor = ColorPicker.select;
      line.strokeWidth = 1;
      const circle = new Shape.Circle(point, radius);
      circle.fillColor = ColorPicker.white;
      circle.strokeColor = ColorPicker.select;
      circle.strokeWidth = 1;
      return [line, circle];
    }
    return [];
  }

  createAnchorPoints(visualObj: Group) {
    const bounds = visualObj.internalBounds as Rectangle;
    const rect = new Shape.Rectangle(bounds);
    rect.strokeColor = ColorPicker.select;
    const size = anchorPointSize;
    const topLeftAnchor = this.createAnchorPoint(
      bounds.topLeft,
      size,
      'topLeft'
    );
    const topCenterAnchor = this.createAnchorPoint(
      bounds.topCenter,
      size,
      'topCenter'
    );
    const topRightAnchor = this.createAnchorPoint(
      bounds.topRight,
      size,
      'topRight'
    );
    const rightCenterAnchor = this.createAnchorPoint(
      bounds.rightCenter,
      size,
      'rightCenter'
    );
    const bottomRightAnchor = this.createAnchorPoint(
      bounds.bottomRight,
      size,
      'bottomRight'
    );
    const bottomCenterAnchor = this.createAnchorPoint(
      bounds.bottomCenter,
      size,
      'bottomCenter'
    );
    const bottomLeftAnchor = this.createAnchorPoint(
      bounds.bottomLeft,
      size,
      'bottomLeft'
    );
    const leftCenterAnchor = this.createAnchorPoint(
      bounds.leftCenter,
      size,
      'leftCenter'
    );
    return [
      rect,
      topLeftAnchor,
      topCenterAnchor,
      topRightAnchor,
      rightCenterAnchor,
      bottomRightAnchor,
      bottomCenterAnchor,
      bottomLeftAnchor,
      leftCenterAnchor
    ];
  }

  createAnchorPoint(point: Point | null, size: number, type: string) {
    const _point = point || new Point(0, 0);
    const originPoint = _point.add(-size / 2);
    const anchorRect = new Rectangle({
      point: [originPoint.x, originPoint.y],
      size: [size, size]
    });
    const anchor = new Shape.Rectangle(anchorRect);
    anchor.fillColor = ColorPicker.white;
    anchor.strokeColor = ColorPicker.select;
    return anchor;
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
