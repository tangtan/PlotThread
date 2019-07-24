import { BaseMouseUtil } from '../util';
import { IHitOption, StoryLine, StoryName } from '../../types';
import paper, { Segment, project, Matrix } from 'paper';

export default class MoveUtil extends BaseMouseUtil {
  isMoveShape: boolean;
  isMoveSegment: boolean;
  selectSegment: Segment | null;
  constructor(hitOption: IHitOption, nodes: StoryLine[], names: StoryName[]) {
    super(hitOption, nodes, names);
    this.isMoveShape = false;
    this.isMoveSegment = false;
    this.selectSegment = null;
  }

  down(e: paper.MouseEvent) {
    if (project && e.point) {
      const hitRes = project.hitTest(e.point, this.hitOption);
      if (hitRes) {
        switch (hitRes.type) {
          case 'fill':
            this.selectPath = hitRes.item;
            this.isMoveShape = true;
            this.selectSegment = null;
            this.isMoveSegment = false;
            break;
          case 'pixel':
            this.selectPath = hitRes.item;
            this.isMoveShape = true;
            this.selectSegment = null;
            this.isMoveSegment = false;
            break;
          case 'segment':
            if (e.modifiers.shift) {
              if (hitRes.segment) {
                hitRes.segment.remove();
              }
            } else {
              this.selectPath = null;
              this.isMoveShape = false;
              this.selectSegment = hitRes.segment;
              this.isMoveSegment = true;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  move(e: paper.MouseEvent) {
    if (project && e.point) {
      project.activeLayer.selected = false;
      const hitRes = project.hitTest(e.point, this.hitOption);
      if (hitRes && hitRes.item) {
        hitRes.item.selected = true;
      }
    }
  }

  up(e: paper.MouseEvent) {
    this.selectPath = null;
    this.selectSegment = null;
    this.isMoveShape = false;
    this.isMoveSegment = false;
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath && this.isMoveShape) {
      if (e.delta) {
        this.selectPath.translate(e.delta);
      }
    }
    if (this.selectSegment && this.isMoveSegment) {
      if (e.delta) {
        const tx = e.delta.x as number;
        const ty = e.delta.y as number;
        const mat = new Matrix(1, 0, 0, 1, tx, ty);
        this.selectSegment.transform(mat);
      }
    }
  }
}
