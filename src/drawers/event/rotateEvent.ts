import paper, { Group, Shape, Point, Path } from 'paper';
import { ColorPicker } from '../../utils/color';
import MoveEvent from './moveEvent';

export default class RotateEvent extends MoveEvent {
  anchorPointSize: number;
  rotation: number;
  isFirstRotate: boolean;
  constructor(visualObj: Group) {
    super(visualObj);
    this.anchorPointSize = 6;
    this.rotation = 0;
    this.isFirstRotate = true;
    this.onMouseDragRotate();
    this.onMouseUpRotate();
  }

  get visualObjBounds() {
    return this.visualObj.internalBounds;
  }

  get selectionBounds() {
    return this.visualObj.data.selectionBounds;
  }

  get rotateAnchor() {
    return this.visualObj.data.selectionBounds.children[1];
  }

  click(e: any) {
    super.click(e);
    // console.log(this.selectionBounds, this.isTransforming);
    if (this.selectionBounds) {
      this.selectionBounds.visible = this.isTransforming;
    }
  }

  onMouseDragRotate() {
    if (!this.rotateAnchor) return;
    this.rotateAnchor.onMouseDrag = (e: paper.MouseEvent) => {
      if (e.point && this.visualObjBounds) {
        const center = this.visualObjBounds.center || this.defaultPoint;
        const theta = e.point.subtract(center).angle || 0;
        const rotation = this.isFirstRotate ? -90 : this.rotation;
        const deltaTheta = theta - rotation;
        // console.log(this.visualObj.applyMatrix, rotation, deltaTheta, theta);
        this.visualObj.rotate(deltaTheta, center);
        this.rotation = theta;
        this.isFirstRotate = false;
        if (this.selectionBounds) {
          this.selectionBounds.visible = false;
          this.selectionBounds.rotate(deltaTheta, center);
        }
      }
    };
  }

  onMouseUpRotate() {
    if (!this.rotateAnchor) return;
    this.rotateAnchor.onMouseUp = () => {
      if (this.selectionBounds && this.isTransforming) {
        // this.selectionBounds.remove();
        // this.selectionBounds = this.createSelectionBounds();
        this.selectionBounds.visible = true;
      }
    };
  }
}
