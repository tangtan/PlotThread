import paper, { Group } from 'paper';
import MoveEvent from './moveEvent';

export default class RotateEvent extends MoveEvent {
  rotation: number;
  degree: number;
  constructor(visualObj: Group) {
    super(visualObj);
    this.rotation = -90; // 相对x轴偏移角度
    this.degree = 0; // 相对初始位置偏移角度
  }

  get visualObjBounds() {
    return this.visualObj.internalBounds;
  }

  get selectionBounds() {
    return this.visualObj.data.selectionBounds;
  }

  set selectionBounds(bounds: Group) {
    this.visualObj.data.selectionBounds = bounds;
  }

  get rotateAnchor() {
    return this.visualObj.data.selectionBounds.children[1];
  }

  click(e: any) {
    super.click(e);
    if (this.selectionBounds) {
      this.selectionBounds.visible = this.isTransforming;
    }
  }

  onMouseDragRotate() {
    if (!this.rotateAnchor) return;
    this.rotateAnchor.onMouseDrag = (e: paper.MouseEvent) => {
      if (e.point && this.visualObjBounds) {
        // 获取旋转中心
        const center = this.visualObjBounds.center || this.defaultPoint;
        // 计算旋转偏移量
        const theta = e.point.subtract(center).angle || 0;
        const deltaTheta = theta - this.rotation;
        this.visualObj.rotate(deltaTheta, center);
        // 记录初始旋转量
        this.rotation = theta;
        // 记录旋转积累量
        this.degree += deltaTheta;
        if (this.selectionBounds) this.selectionBounds.visible = false;
      }
    };
  }
}
