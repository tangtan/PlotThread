import { Group, Color, Point, Path, Shape, Rectangle } from 'paper';
import { ColorPicker } from '../utils/color';
import { Coord } from '../utils/coord';

// Default geometry params for selectionBounds
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
        isDragging: false,
        selectionBounds: null,
        type: type
      }
    });
    compoundGroup.name = this._nameVisualObject(compoundGroup, type);
    return compoundGroup;
  }

  _nameVisualObject(visualObj: Group, type: string) {
    const _type = type.startsWith('data:image') ? 'image' : type;
    const defaultName = `${_type}-${visualObj.index}`;
    switch (type) {
      case 'storyline':
        return visualObj.lastChild.name || defaultName;
      default:
        return defaultName;
    }
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

export function drawSelectionBounds(
  bounds: Rectangle,
  translate?: Point,
  scaleX?: number,
  scaleY?: number,
  degree?: number
) {
  // 先缩放 bounds，此方法可以避免 anchor points 被同步放大缩小
  const center = bounds.center || defaultPoint;
  const _scaleX = scaleX || 1;
  const _scaleY = scaleY || 1;
  const _rect = new Shape.Rectangle(bounds);
  _rect.scale(_scaleX, _scaleY, center);
  const _bounds = _rect.bounds as Rectangle; // NOTE: internalBounds cannot work.
  _rect.remove();
  const selectionBounds = createSelectionBounds(_bounds);
  // 再旋转 bounds
  const _degree = degree || 0;
  selectionBounds.rotate(_degree, center);
  // 最后平移 bounds
  const _translate = translate || defaultPoint;
  selectionBounds.translate(_translate);
  return selectionBounds;
}

function createSelectionBounds(bounds: Rectangle) {
  const rotateItems = createRotatePoint(bounds);
  const anchorPoints = createAnchorPoints(bounds);
  const selectionBounds = new Group([...rotateItems, ...anchorPoints]);
  selectionBounds.visible = false;
  return selectionBounds;
}

function createRotatePoint(bounds: Rectangle) {
  const visualObjBounds = bounds;
  if (visualObjBounds) {
    const topCenter = visualObjBounds.topCenter || defaultPoint;
    const radius = anchorPointSize / 2;
    const rotation = 270;
    const distance = 20;
    const degree = (Math.PI * rotation) / 180;
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

function createAnchorPoints(bounds: Rectangle) {
  const rect = new Shape.Rectangle(bounds);
  rect.strokeColor = ColorPicker.select;
  const size = anchorPointSize;
  const topLeftAnchor = createAnchorPoint(bounds.topLeft, size, 'topLeft');
  const topCenterAnchor = createAnchorPoint(
    bounds.topCenter,
    size,
    'topCenter'
  );
  const topRightAnchor = createAnchorPoint(bounds.topRight, size, 'topRight');
  const rightCenterAnchor = createAnchorPoint(
    bounds.rightCenter,
    size,
    'rightCenter'
  );
  const bottomRightAnchor = createAnchorPoint(
    bounds.bottomRight,
    size,
    'bottomRight'
  );
  const bottomCenterAnchor = createAnchorPoint(
    bounds.bottomCenter,
    size,
    'bottomCenter'
  );
  const bottomLeftAnchor = createAnchorPoint(
    bounds.bottomLeft,
    size,
    'bottomLeft'
  );
  const leftCenterAnchor = createAnchorPoint(
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

function createAnchorPoint(point: Point | null, size: number, type: string) {
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
