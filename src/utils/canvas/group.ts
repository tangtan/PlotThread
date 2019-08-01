import { BaseMouseUtil } from '../util';
import { IHitOption, StorySegment, StoryName, StoryGraph } from '../../types';
import paper, { Path, Base } from 'paper';
import { ColorSet } from '../color';

export default class GroupUtil extends BaseMouseUtil {
  groupInfo: any[][];
  constructor(hitOption: IHitOption) {
    super(hitOption);
    this.groupInfo = [];
  }

  updateStoryStore(graph: StoryGraph) {
    super.updateStoryStore(graph);
  }
}
