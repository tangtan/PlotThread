import { Group } from 'paper';

// Operating the state of the visual object
export default class BasicMouseEvent {
  visualObj: Group;
  constructor(visualObj: Group) {
    this.visualObj = visualObj;
  }

  get objType() {
    return this.visualObj.data.type || 'undefined';
  }

  get isSelected() {
    return this.visualObj.selected || false;
  }

  set isSelected(flag: boolean) {
    this.visualObj.selected = flag;
  }

  get isCreating() {
    return this.visualObj.data.isCreating;
  }

  set isCreating(flag: boolean) {
    this.visualObj.data.isCreating = flag;
  }

  get isTransforming() {
    return this.visualObj.data.isTransforming;
  }

  set isTransforming(flag: boolean) {
    this.visualObj.data.isTransforming = flag;
  }

  get isDragging() {
    return this.visualObj.data.isDragging;
  }

  set isDragging(flag: boolean) {
    this.visualObj.data.isDragging = flag;
  }

  enter(e: any) {
    // if (!this.isTransforming) {
    //   this.isSelected = true;
    // }
    e.stopPropagation();
  }

  leave(e: any) {
    // if (!this.isTransforming) {
    //   this.isSelected = false;
    // }
    e.stopPropagation();
  }

  down(e: any) {
    e.stopPropagation();
  }

  move(e: any) {
    e.stopPropagation();
  }

  up(e: any) {
    e.stopPropagation();
  }

  drag(e: any) {
    this.isDragging = true;
    e.stopPropagation();
  }

  click(e: any) {
    // Temp fix for drag & click bug
    // TODO: 此方法会引出下面当BUG
    // if (this.isDragging) {
    //   this.isDragging = false;
    //   // BUG: 当激活Visual Object后，如果错误drag，则需要单击两次才能取消激活
    //   // this.isTransforming = false;
    //   return;
    // }
    this.isTransforming = !this.isTransforming;
    this.isSelected = !this.isSelected;
    switch (this.objType) {
      case 'text':
      case 'freetext':
      case 'storyline':
        this.isTransforming = false;
        break;
      default:
        if (this.isTransforming) this.isSelected = false;
        break;
    }
    e.stopPropagation();
  }

  dbclick(e: any) {
    e.stopPropagation();
  }
}
