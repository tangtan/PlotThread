import paper, { Path, Item, Point, project } from 'paper';
import { IHitOption, StoryGraph } from '../types';
import { BLACK } from './color';
import { StoryStore } from './hitTest';

export class BaseMouseUtil {
  startPosition: Point | null;
  endPosition: Point | null;
  // selected storyline
  selectPath: Item | null;
  // interaction paths
  currPath: Path | null;
  // paper hitTest option
  hitOption: IHitOption;
  constructor(hitOption: IHitOption) {
    this.startPosition = null;
    this.endPosition = null;
    this.selectPath = null;
    this.currPath = null;
    this.hitOption = hitOption;
  }

  restore() {
    if (this.selectPath) {
      this.selectPath.strokeColor = BLACK;
      this.selectPath = null;
    }
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  mouseUp(e: paper.MouseEvent) {
    this.endPosition = e.point;
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }

  mouseDown(e: paper.MouseEvent) {
    this.startPosition = e.point;
    if (project && e.point) {
      const hitResult = project.hitTest(e.point, this.hitOption);
      if (hitResult) {
        this.selectPath = hitResult.item;
      }
    }
  }

  mouseDrag(e: paper.MouseEvent) {
    this.endPosition = e.point;
    if (this.currPath) {
      this.currPath.remove();
      this.currPath = null;
    }
  }
}

export class StoryUtil extends BaseMouseUtil {
  storyStore: StoryStore | null;
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.storyStore = null;
  }

  updateStoryStore(graph: StoryGraph) {
    this.storyStore = new StoryStore(graph);
  }

  getStartTime() {
    if (!this.startPosition) return -1;
    if (!this.storyStore) return -1;
    const startX = this.startPosition.x as number;
    const startY = this.startPosition.y as number;
    const startTime = this.storyStore.getStoryTimeSpan(startX, startY)[0];
    return startTime;
  }

  getEndTime() {
    if (!this.endPosition) return -1;
    if (!this.storyStore) return -1;
    const endX = this.endPosition.x as number;
    const endY = this.endPosition.y as number;
    const endTime = this.storyStore.getStoryTimeSpan(endX, endY)[1];
    return endTime;
  }
}
