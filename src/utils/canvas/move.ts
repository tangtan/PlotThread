import { StoryUtil } from '../util';
import { IHitOption, StoryGraph } from '../../types';
import {
  Segment,
  project,
  Matrix,
  Point,
  HitResult,
  Raster,
  Group,
  Path
} from 'paper';
import { BLACK } from '../color';

export default class MoveUtil extends StoryUtil {
  isMoveShape: boolean;
  isMoveSegment: boolean;
  selectSegment: Segment | null;
  isScale: boolean;
  isRotate: boolean;
  matrix: Matrix | null;
  rotateShape: Group | null;
  static deltaPixel = 3;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.isMoveShape = false;
    this.isMoveSegment = false;
    this.isScale = false;
    this.isRotate = false;
    this.selectSegment = null;
    this.matrix = null;
    this.rotateShape = null;
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }

  createRotateShape(center: Point, point: Point = new Point(0, -15)) {
    const group = new Group();
    const circle = new Path.Circle(new Point(0, 0), 3);
    circle.strokeColor = BLACK;
    circle.strokeWidth = 1;
    const clickCircle = new Path.Circle(point, 3);
    clickCircle.fillColor = BLACK;
    const path = new Path();
    path.add(new Point(0, 0));
    path.add(point);
    path.strokeWidth = 1;
    path.strokeColor = BLACK;
    group.addChild(circle);
    group.addChild(clickCircle);
    group.addChild(path);
    group.translate(center);
    return group;
  }

  down(e: paper.MouseEvent) {
    if (project && e.point) {
      const hitRes = project.hitTest(e.point, this.hitOption);
      if (hitRes) {
        switch (hitRes.type) {
          case 'fill':
            if (
              hitRes.item &&
              hitRes.item.parent == this.rotateShape &&
              this.selectPath &&
              this.selectPath.matrix
            ) {
              this.matrix = this.selectPath.matrix.clone();
              this.isRotate = true;
              this.selectSegment = null;
              this.isMoveSegment = false;
              this.isMoveShape = true;
            } else {
              this.selectPath = hitRes.item;
              this.isMoveShape = true;
              this.selectSegment = null;
              this.isMoveSegment = false;
            }
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
      this.selectPath = null;
      if (this.rotateShape) {
        this.rotateShape.remove();
        this.rotateShape = null;
      }
      const hitRes = project.hitTest(e.point, this.hitOption);
      if (hitRes && hitRes.item) {
        hitRes.item.selected = true;
        if (hitRes.item instanceof Raster) {
          const raster = hitRes.item;
          if (raster.position) {
            this.rotateShape = this.createRotateShape(raster.position);
            this.selectPath = raster;
          }
        }
      }
    }
  }

  up(e: paper.MouseEvent) {
    this.selectPath = null;
    this.selectSegment = null;
    this.isMoveShape = false;
    this.isMoveSegment = false;
    this.isScale = false;
    this.isRotate = false;
    if (this.rotateShape) {
      this.rotateShape.remove();
      this.rotateShape = null;
    }
  }

  drag(e: paper.MouseEvent) {
    if (this.selectPath && this.isMoveShape) {
      if (e.delta && e.point) {
        if (this.isScale) {
          if (this.startPosition && this.selectPath.position) {
            const scale = e.point
              .subtract(this.selectPath.position)
              .divide(this.startPosition.subtract(this.selectPath.position));
            if (scale.x && scale.y && this.matrix) {
              const mat = this.matrix.clone();
              if (
                mat.a != null &&
                mat.b != null &&
                mat.c != null &&
                mat.d != null
              ) {
                mat.a *= scale.x;
                mat.c *= scale.x;
                mat.b *= scale.y;
                mat.d *= scale.y;
              }
              this.selectPath.matrix = mat;
            }
          }
        } else if (this.isRotate) {
          if (this.selectPath.position) {
            const center = this.selectPath.position;
            const delta = e.point.subtract(center);
            if (this.rotateShape) {
              this.rotateShape.remove();
              this.rotateShape = this.createRotateShape(center, delta);
            }
            if (this.matrix && delta.x && delta.y) {
              const mat = new Matrix();
              let angle = (Math.atan(-delta.x / delta.y) / Math.PI) * 180;
              if (delta.y > 0) {
                angle += 180;
              }
              mat.rotate(angle, new Point(0, 0));
              this.selectPath.matrix = mat.prepend(this.matrix);
            }
          }
        } else {
          this.selectPath.translate(e.delta);
          if (this.rotateShape) {
            this.rotateShape.translate(e.delta);
          }
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
