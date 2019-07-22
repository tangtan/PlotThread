import { BaseMouseUtil } from '../util';
import { IHitOption, StoryLine, StoryName } from '../../types';
import paper, { Path, Base } from 'paper';
import { ColorSet } from '../color';

export default class GroupUtil extends BaseMouseUtil {
  groupInfo: any[][];
  constructor(hitOption: IHitOption, nodes: StoryLine[], names: StoryName[]) {
    super(hitOption, nodes, names);
    this.groupInfo = [];
  }
}
