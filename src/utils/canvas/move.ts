import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import { Segment, project, Matrix, Point, HitResult, Raster } from 'paper';

export default class MoveUtil extends StoryUtil {
  isMoveShape: boolean;
  isMoveSegment: boolean;
  selectSegment: Segment | null;
  isScale: boolean;
  matrix: Matrix | null;
  static deltaPixel = 3;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.isMoveShape = false;
    this.isMoveSegment = false;
    this.isScale = false;
    this.selectSegment = null;
    this.matrix = null;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
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
            const val = (i: number, j: number) => {
              if (project && e.point && e.point.x && e.point.y) {
                const point = new Point(
                  e.point.x + i * MoveUtil.deltaPixel,
                  e.point.y + j * MoveUtil.deltaPixel
                );
                return project.hitTest(point, this.hitOption);
              }
              return null;
            };
            const res = [val(-1, -1), val(1, -1), val(-1, 1), val(1, 1)];
            let ant = 0;
            let result: HitResult | null = null;
            for (let i = 0; i < res.length; ++i) {
              if (res[i]) {
                ant++;
                result = res[i];
              }
            }
            if (ant == 1) {
              if (result) {
                this.isScale = true;
                this.startPosition = e.point;
                if (this.selectPath && this.selectPath.matrix) {
                  this.matrix = this.selectPath.matrix.clone();
                }
              }
            } else {
              this.isScale = false;
            }
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
    this.isScale = false;
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath && this.isMoveShape) {
      if (e.delta && e.point) {
        if (this.isScale) {
          if (this.startPosition && this.selectPath.position) {
            const matrix = this.selectPath.matrix;
            const scale = e.point
              .subtract(this.selectPath.position)
              .divide(this.startPosition.subtract(this.selectPath.position));
            if (scale.x && scale.y && matrix && this.matrix) {
              const mat = new Matrix(scale.x, 0, 0, scale.y, 0, 0);
              this.selectPath.matrix = mat.prepend(this.matrix);
            }
          }
        } else {
          this.selectPath.translate(e.delta);
        }
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
