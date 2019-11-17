import paper, { Group, Shape, Rectangle, Point, Matrix } from 'paper';
import RotateEvent from './rotateEvent';

export default class ScaleEvent extends RotateEvent {
  constructor(visualObj: Group) {
    super(visualObj);
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
  }

  get selectionFrame() {
    return this.selectionBounds.children[2];
  }

  get topLeftAnchor() {
    return this.selectionBounds.children[3];
  }

  get topCenterAnchor() {
    return this.selectionBounds.children[4];
  }

  get topRightAnchor() {
    return this.selectionBounds.children[5];
  }

  get rightCenterAnchor() {
    return this.selectionBounds.children[6];
  }

  get bottomRightAnchor() {
    return this.selectionBounds.children[7];
  }

  get bottomCenterAnchor() {
    return this.selectionBounds.children[8];
  }

  get bottomLeftAnchor() {
    return this.selectionBounds.children[9];
  }

  get leftCenterAnchor() {
    return this.selectionBounds.children[10];
  }

  onMouseDragAnchor(anchor: Shape, type: string) {
    anchor.onMouseDrag = (e: paper.MouseEvent) => {
      let scalingCenter: Point | null = null;
      let scaleX = 1;
      let scaleY = 1;
      if (e.delta && this.visualObjBounds && this.selectionBounds) {
        let eDelta = e.delta.rotate(
          -this.rotation,
          this.visualObjBounds.center || this.defaultPoint
        );
        const deltaX = eDelta.x || 0;
        const deltaY = eDelta.y || 0;
        scalingCenter = this.getScalingCenter(type);
        switch (type) {
          case 'topLeft':
            // scalingCenter = this.visualObjBounds.bottomRight;
            scaleX = 1 - (deltaX || 0) / (this.visualObjBounds.width || 1);
            scaleY = 1 - (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'topRight':
            // scalingCenter = this.visualObjBounds.bottomLeft;
            scaleX = 1 + (deltaX || 0) / (this.visualObjBounds.width || 1);
            scaleY = 1 - (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'bottomRight':
            // scalingCenter = this.visualObjBounds.topLeft;
            scaleX = 1 + (deltaX || 0) / (this.visualObjBounds.width || 1);
            scaleY = 1 + (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'bottomLeft':
            // scalingCenter = this.visualObjBounds.topRight;
            scaleX = 1 - (deltaX || 0) / (this.visualObjBounds.width || 1);
            scaleY = 1 + (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'topCenter':
            // scalingCenter = this.visualObjBounds.bottomCenter;
            scaleY = 1 - (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'bottomCenter':
            // scalingCenter = this.visualObjBounds.topCenter;
            scaleY = 1 + (deltaY || 0) / (this.visualObjBounds.height || 1);
            break;
          case 'leftCenter':
            // scalingCenter = this.visualObjBounds.rightCenter;
            scaleX = 1 - (deltaX || 0) / (this.visualObjBounds.width || 1);
            break;
          case 'rightCenter':
            // scalingCenter = this.visualObjBounds.leftCenter;
            scaleX = 1 + (deltaX || 0) / (this.visualObjBounds.width || 1);
            break;
          default:
            break;
        }
        if (scaleX > 0 && scaleY > 0) {
          this.visualObj.scale(scaleX, scaleY, scalingCenter as Point);
          this.selectionBounds.scale(scaleX, scaleY, scalingCenter as Point);
        }
        if (this.selectionBounds) this.selectionBounds.visible = false;
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

  onMouseUpAnchor(anchor: Shape) {
    anchor.onMouseUp = () => {
      if (this.selectionBounds && this.isTransforming) {
        this.selectionBounds.visible = true;
      }
    };
  }
}
