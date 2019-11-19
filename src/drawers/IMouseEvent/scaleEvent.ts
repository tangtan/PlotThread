import paper, { Group, Shape, Point } from 'paper';
import RotateEvent from './rotateEvent';
import { drawSelectionBounds } from '../baseDrawer';

export default class ScaleEvent extends RotateEvent {
  scaleFactorX: number;
  scaleFactorY: number;
  constructor(visualObj: Group) {
    super(visualObj);
    this.scaleFactorX = 1;
    this.scaleFactorY = 1;
    this.onMouseAnchors();
  }

  get selectionFrame() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[2] as Shape;
  }

  get topLeftAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[3] as Shape;
  }

  get topCenterAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[4] as Shape;
  }

  get topRightAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[5] as Shape;
  }

  get rightCenterAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[6] as Shape;
  }

  get bottomRightAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[7] as Shape;
  }

  get bottomCenterAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[8] as Shape;
  }

  get bottomLeftAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[9] as Shape;
  }

  get leftCenterAnchor() {
    if (!this.selectionBounds) return null;
    if (!this.selectionBounds.children) return null;
    return this.selectionBounds.children[10] as Shape;
  }

  // 绑定缩放、旋转控制点的交互事件
  onMouseAnchors() {
    this.onMouseDragAnchor(this.topLeftAnchor, 'topLeft');
    this.onMouseUpAnchor(this.topLeftAnchor);
    this.onMouseDragAnchor(this.topCenterAnchor, 'topCenter');
    this.onMouseUpAnchor(this.topCenterAnchor);
    this.onMouseDragAnchor(this.topRightAnchor, 'topRight');
    this.onMouseUpAnchor(this.topRightAnchor);
    this.onMouseDragAnchor(this.rightCenterAnchor, 'rightCenter');
    this.onMouseUpAnchor(this.rightCenterAnchor);
    this.onMouseDragAnchor(this.bottomRightAnchor, 'bottomRight');
    this.onMouseUpAnchor(this.bottomRightAnchor);
    this.onMouseDragAnchor(this.bottomCenterAnchor, 'bottomCenter');
    this.onMouseUpAnchor(this.bottomCenterAnchor);
    this.onMouseDragAnchor(this.bottomLeftAnchor, 'bottomLeft');
    this.onMouseUpAnchor(this.bottomLeftAnchor);
    this.onMouseDragAnchor(this.leftCenterAnchor, 'leftCenter');
    this.onMouseUpAnchor(this.leftCenterAnchor);
    this.onMouseDragRotate();
    this.onMouseUpAnchor(this.rotateAnchor);
  }

  onMouseDragAnchor(anchor: Shape | null, type: string) {
    if (!anchor) return;
    anchor.onMouseDrag = (e: paper.MouseEvent) => {
      if (e.delta && this.selectionBounds) {
        const degree = this.degree;
        // 将位移变换到 Visual Object 本地坐标系
        let eDelta = e.delta.rotate(-degree, this.defaultPoint);
        const deltaX = eDelta.x || 0;
        const deltaY = eDelta.y || 0;
        // 获取缩放中心
        const scalingCenter = this.getScalingCenter(type) as Point;
        // 获取本地坐标系中水平方向以及垂直方向的缩放因子
        const [scaleX, scaleY] = this.getScalingFactor(type, deltaX, deltaY);
        if (scaleX > 0 && scaleY > 0) {
          // 先将 Visual Object 变换到屏幕坐标系
          this.visualObj.rotate(-degree, scalingCenter);
          // 在屏幕坐标系中对 Visual Object 进行缩放
          this.visualObj.scale(scaleX, scaleY, scalingCenter);
          // 最后将 Visual Object 变换到本地坐标系
          this.visualObj.rotate(degree, scalingCenter);
          // 记录累积变换量
          this.scaleFactorX *= scaleX;
          this.scaleFactorY *= scaleY;
        }
        this.selectionBounds.visible = false;
      }
    };
  }

  getScalingCenter(type: string) {
    if (!this.selectionBounds) return this.defaultPoint;
    if (!this.selectionBounds.children) return this.defaultPoint;
    switch (type) {
      case 'topLeft':
        return this.selectionBounds.children[7].position;
      case 'topCenter':
        return this.selectionBounds.children[8].position;
      case 'topRight':
        return this.selectionBounds.children[9].position;
      case 'rightCenter':
        return this.selectionBounds.children[10].position;
      case 'bottomRight':
        return this.selectionBounds.children[3].position;
      case 'bottomCenter':
        return this.selectionBounds.children[4].position;
      case 'bottomLeft':
        return this.selectionBounds.children[5].position;
      case 'leftCenter':
        return this.selectionBounds.children[6].position;
      default:
        return this.defaultPoint;
    }
  }

  getScalingFactor(type: string, deltaX: number, deltaY: number) {
    let scaleX = 1;
    let scaleY = 1;
    if (!this.selectionBounds) return [scaleX, scaleY];
    const visualObjBoundsWidth =
      this.initialVisualObjBoundsWidth * this.scaleFactorX;
    const visualObjBoundsHeight =
      this.initialVisualObjBoundsHeight * this.scaleFactorY;
    switch (type) {
      case 'topLeft':
        scaleX = 1 - deltaX / visualObjBoundsWidth;
        scaleY = 1 - deltaY / visualObjBoundsHeight;
        break;
      case 'topRight':
        scaleX = 1 + deltaX / visualObjBoundsWidth;
        scaleY = 1 - deltaY / visualObjBoundsHeight;
        break;
      case 'bottomRight':
        scaleX = 1 + deltaX / visualObjBoundsWidth;
        scaleY = 1 + deltaY / visualObjBoundsHeight;
        break;
      case 'bottomLeft':
        scaleX = 1 - deltaX / visualObjBoundsWidth;
        scaleY = 1 + deltaY / visualObjBoundsHeight;
        break;
      case 'topCenter':
        scaleY = 1 - deltaY / visualObjBoundsHeight;
        break;
      case 'bottomCenter':
        scaleY = 1 + deltaY / visualObjBoundsHeight;
        break;
      case 'leftCenter':
        scaleX = 1 - deltaX / visualObjBoundsWidth;
        break;
      case 'rightCenter':
        scaleX = 1 + deltaX / visualObjBoundsWidth;
        break;
      default:
        break;
    }
    return [scaleX, scaleY];
  }

  onMouseUpAnchor(anchor: Shape | null) {
    if (!anchor) return;
    anchor.onMouseUp = () => {
      if (this.selectionBounds && this.isTransforming) {
        // NOTE: 计算 Visual Object 相对初始位置的位移量
        if (this.visualObjBounds) {
          const newCenter = this.visualObjBounds.center;
          const oldCenter = this.initialVisualObjBounds.center;
          if (newCenter && oldCenter) {
            this.translatePoint = newCenter.subtract(oldCenter);
          }
        }
        // 更新 selectionBounds
        this.selectionBounds.remove();
        const bounds = this.initialVisualObjBounds;
        const { translatePoint, scaleFactorX, scaleFactorY, degree } = this;
        this.selectionBounds = drawSelectionBounds(
          bounds,
          translatePoint,
          scaleFactorX,
          scaleFactorY,
          degree
        );
        this.selectionBounds.visible = true;
        this.onMouseAnchors();
      }
    };
  }
}
