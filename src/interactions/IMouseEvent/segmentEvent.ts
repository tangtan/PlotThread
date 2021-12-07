import { Path, Segment, Point } from 'paper';
import store from '../../store';

export default function dragSegment(
  e: paper.MouseEvent,
  path: Path,
  limits = 6
) {
  let characterID = -1,
    segmentID = -1,
    deltaY = 0;
  if (path.segments) {
    if (path.segments.length < limits) {
      smoothDragPath(path, path.firstSegment, 0);
      smoothDragPath(path, path.lastSegment, 1);
    }
    deltaY = e.delta ? (e.delta.y ? e.delta.y : 0) : 0;
    characterID = path.data.characterID;
    segmentID = path.data.segmentID;
    for (let i = 2; i < path.segments.length - 2; i++) {
      let segment = path.segments[i];
      if (segment.point) {
        let prevY = segment.point.y as number;
        segment.point.y = prevY + deltaY;
      }
    }
    let firstSegment = path.firstSegment;
    let nxtSeg = firstSegment.next.next;
    let pathStr = getSmoothPathStrBetween(firstSegment, nxtSeg);
    shiftDragPath(pathStr, path, 0);

    let lastSegment = path.lastSegment;
    let prvSeg = lastSegment.previous.previous;
    pathStr = getSmoothPathStrBetween(prvSeg, lastSegment);
    shiftDragPath(pathStr, path, 1);
  }
  return { characterID, segmentID, deltaY };
}

function shiftDragPath(pathStr: string, path: Path, type: number) {
  let newPath = new Path(pathStr);
  if (newPath.segments && path.segments) {
    if (type) {
      path.removeSegment(path.segments.length - 1);
      path.removeSegment(path.segments.length - 1);
      path.add(new Segment(newPath.segments[1]));
      path.add(new Segment(newPath.segments[2]));
    } else {
      path.removeSegment(0);
      path.removeSegment(0);
      path.insert(0, new Segment(newPath.segments[2]));
      path.insert(0, new Segment(newPath.segments[1]));
    }
  }
  newPath.remove();
}

function getSmoothPathStrBetween(lSegment: Segment, rSegment: Segment) {
  let pathStr = ``;
  if (lSegment.point) {
    let prevX = lSegment.point.x as number;
    let prevY = lSegment.point.y as number;
    if (rSegment.point) {
      let nextX = rSegment.point.x as number;
      let nextY = rSegment.point.y as number;
      const middleX = (nextX + prevX) / 2;
      pathStr = `M ${prevX - 10} ${prevY} L ${prevX} ${prevY}`;
      pathStr += `C ${middleX} ${prevY} ${middleX} ${nextY} ${nextX} ${nextY} L ${nextX +
        10} ${nextY}`;
    }
  }
  return pathStr;
}

function smoothDragPath(
  path: Path,
  segment: Segment,
  type: number,
  smoothRate = 0.4
) {
  let middleX = 0;
  let middleY = 0;
  if (segment.point) {
    let prevX = segment.point.x as number;
    let prevY = segment.point.y as number;
    let nxtSeg = type ? segment.previous : segment.next;
    let deltaX = 0;
    if (nxtSeg) {
      if (nxtSeg.point) {
        let nextX = nxtSeg.point.x as number;
        deltaX = nextX - prevX;
        segment.point.x = prevX + deltaX * smoothRate;
        middleX = (prevX + segment.point.x) / 2;
        middleY = prevY;
        if (type) {
          path.add(new Point(middleX, middleY));
          path.add(new Point(prevX, prevY));
        } else {
          path.insert(0, new Point(middleX, middleY));
          path.insert(0, new Point(prevX, prevY));
        }
      }
    }
  }
}

export function updateSegment(path: Path) {
  const downPoint = path.data.downPoint;
  const dragPoint = path.data.dragPoint;
  if (downPoint && dragPoint) {
    let deltaY = dragPoint.y - downPoint.y;
    if (Math.abs(deltaY) < 1e-3) {
    } else {
      let characterID = path.data.characterID;
      let segmentID = path.data.segmentID;
      if (characterID !== -1 && segmentID !== -1) {
        // store.dispatch(changeLayoutAction(characterID, segmentID, deltaY));
      }
    }
  }
}

export function deepCopy(x: any) {
  return JSON.parse(JSON.stringify(x));
}
