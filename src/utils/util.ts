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
  // storyline hitTest
  storyStore: StoryStore | null;
  constructor(hitOption: IHitOption) {
    this.startPosition = null;
    this.endPosition = null;
    this.selectPath = null;
    this.currPath = null;
    this.storyStore = null;
    this.hitOption = hitOption;
  }

  updateStoryStore(graph: StoryGraph) {
    this.storyStore = new StoryStore(graph);
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
