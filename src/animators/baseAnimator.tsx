import { Path, Point, Matrix } from 'paper';

export default class BaseAnimator {
  constructor() {}
  static Animate(
    type: string,
    strokes: Path[],
    prevStrokes: Path[],
    segmentIDs: number[]
  ) {
    switch (type) {
      case 'regionalTransition':
        this.RegionalTransit(strokes, prevStrokes, segmentIDs);
        break;
      case 'globalTransition':
        this.GlobalTransit(strokes, prevStrokes);
        break;
      case 'creation':
        this.Create(strokes);
        break;
      default:
        break;
    }
  }
  static RegionalTransit(
    strokes: Path[],
    prevStoryline: Path[],
    segmentIDs: number[]
  ) {
    let flag = [];
    for (let i = 0; i < strokes.length; i++) flag[i] = 0;
    for (let i = 0; i < segmentIDs.length; i++) {
      this.TransitBetweenTwoPath(
        prevStoryline[segmentIDs[i]],
        strokes[segmentIDs[i]]
      );
      flag[segmentIDs[i]] = 1;
    }

    for (let i = 0; i < strokes.length; i++) {
      if (!flag[i]) {
        strokes[i].visible = true;
      }
    }
  }
  static GlobalTransit(strokes: Path[], prevStoryline: Path[]) {
    for (let i = 0; i < strokes.length; i++) {
      this.TransitBetweenTwoPath(prevStoryline[i], strokes[i]);
    }
  }
  static async Create(strokes: Path[], duration = 1000) {
    let cnt = 0;
    while (cnt < strokes.length) {
      cnt = await this.TweenFromFirstSegment(
        strokes[cnt],
        cnt,
        duration / strokes.length
      );
    }
  }
  static TweenBetweenTwoPath(
    path: Path,
    pathTo: Path,
    cnt: number,
    duration = 200
  ) {
    // synchronize two paths
    const segments = path.segments || [];
    const segmentsTo = pathTo.segments || [];
    while (segments.length !== segmentsTo.length) {
      const lastIndex = segments.length - 1;
      const lastSegment = path.lastSegment;
      if (segments.length > segmentsTo.length) {
        path.removeSegment(lastIndex);
      } else {
        path.add(lastSegment);
      }
    }

    // tween two paths
    const pathFrom = path.clone({ insert: false }) as Path;
    setTimeout(
      function(path: Path, pathFrom: Path, pathTo: Path) {
        path.tween(duration).onUpdate = (e: any) => {
          path.visible = true;
          path.interpolate(pathFrom, pathTo, e.factor);
        };
      },
      (cnt + 1) * duration,
      path,
      pathFrom,
      pathTo
    );
    return cnt + 1;
  }
  static TransitBetweenTwoPath(path: Path, pathTo: Path, duration = 200) {
    const segments = path.segments || [];
    const segmentsTo = pathTo.segments || [];
    while (segments.length !== segmentsTo.length) {
      const lastIndex = segments.length - 1;
      const lastSegment = path.lastSegment;
      if (segments.length > segmentsTo.length) {
        path.removeSegment(lastIndex);
      } else {
        path.add(lastSegment);
      }
    }

    // tween two paths
    const pathToTo = pathTo.clone({ insert: false }) as Path;
    pathTo.tween(duration).onUpdate = (e: any) => {
      pathTo.interpolate(path, pathToTo, e.factor);
      pathTo.visible = true;
    };
  }
  static async TweenFromFirstSegment(path: Path, cnt: number, duration = 200) {
    // path.set({ insert: false });
    const pathTo = path.clone({ insert: false }) as Path;
    const firstSegment = path.firstSegment;
    const segments = path.segments || [];
    segments.forEach(segment => {
      const point = segment.point as Point;
      const oldX = point.x as number;
      const oldY = point.y as number;
      const newPoint = firstSegment.point as Point;
      const newX = newPoint.x as number;
      const newY = newPoint.y as number;
      const moveMat = new Matrix(1, 0, 0, 1, newX - oldX, newY - oldY);
      segment.transform(moveMat);
    });
    cnt = await this.TweenBetweenTwoPath(path, pathTo, cnt, duration);
    pathTo.remove();
    return cnt;
  }
}
